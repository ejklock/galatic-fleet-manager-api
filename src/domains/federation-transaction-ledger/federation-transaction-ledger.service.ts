import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { FederationTransactionLedgerEntity } from './federation-transaction-ledger.entity';

@Injectable()
export class FederationTransactionLedgerService extends BaseService<FederationTransactionLedgerEntity> {
  constructor(
    @InjectRepository(FederationTransactionLedgerEntity)
    private readonly federationTransactionLedgerRepository: Repository<FederationTransactionLedgerEntity>,
  ) {
    super(federationTransactionLedgerRepository);
  }

  public async registerTransaction(
    description: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(
      FederationTransactionLedgerEntity,
      queryRunner,
    );
    await repository.save({ description });
  }
}
