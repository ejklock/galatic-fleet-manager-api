import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ContractEntity } from './contract.entity';

@Injectable()
export class ContractService extends BaseService<ContractEntity> {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {
    super(contractRepository);
  }
}
