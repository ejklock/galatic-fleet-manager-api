import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
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
  ) {
    super(contractRepository);
  }

  public async findOneWithWeightCount(id: number) {
    const queryBuilder = this.contractRepository
      .createQueryBuilder('contracts')
      .leftJoin('contracts.contractResources', 'contractResources')
      .leftJoin('contractResources.resource', 'resource')
      .addSelect([
        'SUM(resource.weight * contractResources.quantity) AS contracts_payload',
      ])
      .groupBy('contracts.id')
      .where('contracts.id = :id', { id })
      .getOne();
    return queryBuilder;
  }
  public async getAllPaginatedWithWeightCount(
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<ContractEntity>> {
    const queryBuilder = this.contractRepository
      .createQueryBuilder('contracts')
      .leftJoin('contracts.contractResources', 'contractResources')
      .leftJoin('contractResources.resource', 'resource')
      .addSelect([
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
  ): Promise<ResourceEntity[]> {
    this.logger.log('Validate resources list');
    const resourcesIds = contractResources.map(
      (resource) => resource.resourceId,
    );
    const existentResources = await this.getEntityManager()
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
    const travelConfig = await this.getEntityManager()
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
  ) {
    this.logger.log('Store contract resources');

    await this.getEntityManager()
      .getRepository(ContractResourceEntity)
      .insert(
        contractResources.map((resource) => ({
          contractId,
          ...resource,
        })),
      );
  }

  public async storeWithResources(
    contract: DeepPartial<ContractEntity>,
    contractResources: ContractResource[],
  ) {
    this.logger.log('Store validating travel configs and resources');

    return this.executeInTransaction(async (queryRunner: QueryRunner) => {
      await this.validateTravelConfig(
        contract.originPlanetId,
        contract.destinationPlanetId,
      );
      await this.validateResourcesList(contractResources);

      const createdContract = await queryRunner.manager.save(ContractEntity, {
        status: ContractStatusEnum.PENDING,
        ...contract,
      });

      await queryRunner.manager.getRepository(ContractResourceEntity).insert(
        contractResources.map((resource) => ({
          contractId: createdContract.id,
          ...resource,
        })),
      );

      return createdContract;
    });
  }

  public acceptContract(id: number) {
    this.logger.log('Accept contract');
    return this.update(id, {
      status: ContractStatusEnum.ACCEPTED,
    });
  }
}
