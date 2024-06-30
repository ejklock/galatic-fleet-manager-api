import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { ApiPaginatedResponse } from '../common/common.types';
import { ContractResourceService } from '../contract-resource/contract-resource.service';
import { PilotService } from '../pilot/pilot.service';
import { ResourceEntity } from '../resource/resource.entity';
import { TravelConfigService } from '../travel-config/travel-config.service';
import { ContractEntity } from './contract.entity';
import { ContractResource, ContractStatusEnum } from './contract.types';

@Injectable()
export class ContractService extends BaseService<ContractEntity> {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    private readonly travelConfigService: TravelConfigService,
    private readonly pilotService: PilotService,
    private readonly contractResourceService: ContractResourceService,
  ) {
    super(contractRepository);
  }

  private getTotalWeightQueryString() {
    return `(
        SELECT SUM(r2.weight * cr2.quantity)
        FROM contract_resources cr2
        LEFT JOIN resources r2 ON r2.id = cr2.resource_id
        WHERE cr2.contract_id = contracts.id
        )`;
  }

  public async findOneWithTotalWeight(id: number) {
    const queryBuilder = this.contractRepository
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.payload', 'pr')
      .leftJoinAndSelect('pr.resource', 'r')
      .addSelect(this.getTotalWeightQueryString(), 'contracts_total_weight')
      .groupBy('contracts.id')
      .addGroupBy('pr.id')
      .orderBy('contracts.id')
      .where('contracts.id = :id', { id })
      .getOne();
    return queryBuilder;
  }
  public async getAllPaginatedWithTotalWeight(
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<ContractEntity>> {
    const queryBuilder = this.contractRepository
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.payload', 'pr')
      .leftJoinAndSelect('pr.resource', 'r')
      .addSelect(this.getTotalWeightQueryString(), 'contracts_total_weight')
      .groupBy('contracts.id')
      .addGroupBy('pr.id')
      .orderBy('contracts.id')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.buildPaginationResponse(data, total, page, limit);
  }

  protected async validateResourcesList(
    contractResources: ContractResource[],
    queryRunner?: QueryRunner,
  ): Promise<ResourceEntity[]> {
    this.logger.log('Validate resources list');
    const resourcesIds = contractResources.map(
      (resource) => resource.resourceId,
    );

    const resourceRepository = queryRunner
      ? queryRunner.manager.getRepository(ResourceEntity)
      : this.getEntityManager().getRepository(ResourceEntity);

    const existentResources = await resourceRepository
      .createQueryBuilder('resources')
      .where('resources.id IN (:...resources)', { resources: resourcesIds })
      .getMany();

    if (existentResources.length !== resourcesIds.length) {
      throw new Error('One or more resources do not exist');
    }

    return existentResources;
  }

  public async storeWithResources(
    contract: DeepPartial<ContractEntity>,
    contractResources: ContractResource[],
  ) {
    this.logger.log('Store validating travel configs and resources');

    return this.executeInTransaction(async (queryRunner: QueryRunner) => {
      await this.pilotService.validatePilot(contract.pilotId, queryRunner);

      await this.travelConfigService.validateTravelConfig(
        contract.originPlanetId,
        contract.destinationPlanetId,
        queryRunner,
      );
      await this.validateResourcesList(contractResources, queryRunner);

      const createdContract = await queryRunner.manager.save(ContractEntity, {
        status: ContractStatusEnum.PENDING,
        ...contract,
      });

      await this.contractResourceService.storeContractResources(
        createdContract.id,
        contractResources,
        queryRunner,
      );

      return createdContract;
    });
  }
  public async validateContract(
    contractId?: number,
    queryRunner?: QueryRunner,
  ): Promise<ContractEntity> {
    this.logger.log('Validate contract');

    const contract = await this.getRepository(
      ContractEntity,
      queryRunner,
    ).findOne({
      where: { id: contractId },
    });
    if (!contract) {
      throw new DomainRuleViolationException(
        `Contract with id ${contractId} does not exist`,
      );
    }
    return contract;
  }

  public async validateIfContractIsAccepted(
    contractId: number,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Validate if contract is accepted');

    const contract = await this.validateContract(contractId, queryRunner);
    if (contract.status !== ContractStatusEnum.ACCEPTED) {
      throw new DomainRuleViolationException(
        `Contract with id ${contractId} is not accepted`,
      );
    }
    return contract;
  }
  public acceptContract(id: number) {
    this.logger.log('Accept contract');
    return this.update(id, {
      status: ContractStatusEnum.ACCEPTED,
    });
  }
}
