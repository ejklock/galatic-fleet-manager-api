import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { ApiPaginatedResponse } from '../common/common.types';
import { ContractResourceEntity } from '../contract-resource/contract-resource.entity';
import { ResourceEntity } from '../resource/resource.entity';
import { TravelConfigEntity } from '../travel-config/travel-config.entity';
import { ContractEntity } from './contract.entity';
import { ContractResource, ContractStatusEnum } from './contract.types';

@Injectable()
export class ContractService extends BaseService<ContractEntity> {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    private readonly dataSource: DataSource,
  ) {
    super(contractRepository);
  }

  public async getAllPaginatedWithWeightCount(
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<ContractEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.contractResources', 'contractResources')
      .leftJoinAndSelect('contractResources.resource', 'resource')
      .select([
        'contracts.id',
        'contracts.originPlanetId',
        'contracts.destinationPlanetId',
        'contracts.pilotId',
        'contracts.description',
        'contracts.value',
        'SUM(resource.weight * contractResources.quantity) AS contracts_payload',
      ])
      .groupBy('contracts.id')
      .orderBy('contracts.id')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.buildPaginationResponse(data, total, page, limit);
  }

  protected async validateResourcesList(
    contractResources: ContractResource[],
    queryRunner: QueryRunner,
  ): Promise<ResourceEntity[]> {
    this.logger.log('Validate resources list');
    const resourcesIds = contractResources.map(
      (resource) => resource.resourceId,
    );
    const existentResources = await queryRunner.manager
      .getRepository(ResourceEntity)
      .createQueryBuilder('resources')
      .where('resources.id IN (:...resources)', { resources: resourcesIds })
      .getMany();
    if (existentResources.length !== resourcesIds.length) {
      throw new Error('One or more resources do not exist');
    }

    return existentResources;
  }

  protected async validateTravelConfig(
    originPlanetId: number,
    destinationPlanetId: number,
  ): Promise<void> {
    this.logger.log('Validate travel config');
    const travelConfig = await this.dataSource.manager
      .getRepository(TravelConfigEntity)
      .findOne({
        where: {
          fromPlanetId: originPlanetId,
          toPlanetId: destinationPlanetId,
        },
      });

    if (!travelConfig) {
      throw new DomainRuleViolationException(
        `Travel from planet:${originPlanetId} to planet:${destinationPlanetId} is not valid. Configure the travel in the travel-configs endpoint`,
      );
    }
  }

  protected async storeContractResources(
    contractId: number,
    contractResources: ContractResource[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Store contract resources');

    const repository = queryRunner
      ? queryRunner.manager.getRepository(ContractResourceEntity)
      : this.dataSource.getRepository(ContractResourceEntity);

    await repository.insert(
      contractResources.map((resource) => ({
        contractId,
        ...resource,
      })),
    );
  }

  protected async storeContract(
    contract: DeepPartial<ContractEntity>,
    status: ContractStatusEnum = ContractStatusEnum.PENDING_RESOURCES,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Store contract');

    const repository = queryRunner
      ? queryRunner.manager.getRepository(ContractEntity)
      : this.dataSource.getRepository(ContractEntity);

    return await repository.save({
      ...contract,
      status: status,
    });
  }

  public async storeValidatingTravelConfigsAndResources(
    contract: DeepPartial<ContractEntity>,
    contractResources: ContractResource[],
  ) {
    this.logger.log('Store validating travel configs and resources');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this.validateTravelConfig(
        contract.originPlanetId,
        contract.destinationPlanetId,
      );

      await this.validateResourcesList(contractResources, queryRunner);

      const result = await this.storeContract(
        contract,
        ContractStatusEnum.PENDING,
        queryRunner,
      );

      await this.storeContractResources(
        result.id,
        contractResources,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  public acceptContract(id: number) {
    this.logger.log('Accept contract');
    return this.update(id, {
      status: ContractStatusEnum.ACCEPTED,
    });
  }
}
