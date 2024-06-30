import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ContractResource } from '../contract/contract.types';
import { ContractResourceEntity } from './contract-resource.entity';

@Injectable()
export class ContractResourceService extends BaseService<ContractResourceEntity> {
  constructor(
    @InjectRepository(ContractResourceEntity)
    private readonly contractResourceRepository: Repository<ContractResourceEntity>,
  ) {
    super(contractResourceRepository);
  }

  public async storeContractResources(
    contractId: number,
    contractResources: ContractResource[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Store contract resources');

    const contractResourceRepository = queryRunner
      ? queryRunner.manager.getRepository(ContractResourceEntity)
      : this.getEntityManager().getRepository(ContractResourceEntity);

    await contractResourceRepository.insert(
      contractResources.map((resource) => ({
        contractId,
        ...resource,
      })),
    );
  }
}
