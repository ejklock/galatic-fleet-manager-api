import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { PilotCreditTransactionEntity } from './pilot-credit-transaction.entity';
import { PilotCreditTransactionTypeEnum } from './pilot-credit-transaction.types';

@Injectable()
export class PilotCreditTransactionService extends BaseService<PilotCreditTransactionEntity> {
  constructor(
    @InjectRepository(PilotCreditTransactionEntity)
    private readonly pilotCreditTransactionRepository: Repository<PilotCreditTransactionEntity>,
  ) {
    super(pilotCreditTransactionRepository);
  }

  protected async createTransaction(
    pilotId: number,
    transactionAmount: number,
    transactionDescription: string,
    transactionType: PilotCreditTransactionTypeEnum,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Create pilot credit transaction');

    await this.getRepository(PilotCreditTransactionEntity, queryRunner).save({
      pilotId,
      description: transactionDescription,
      amount:
        transactionType === PilotCreditTransactionTypeEnum.DEBIT
          ? -transactionAmount
          : transactionAmount,
      type: transactionType,
    });
  }

  public async createPilotDebitTransaction(
    pilotId: number,
    description: string,
    transactionAmount: number,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Create pilot debit transaction');

    await this.createTransaction(
      pilotId,
      transactionAmount,
      description,
      PilotCreditTransactionTypeEnum.DEBIT,
      queryRunner,
    );
  }

  public async createPilotCreditTransaction(
    pilotId: number,
    description: string,
    transactionAmount: number,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Create pilot credit transaction');

    await this.createTransaction(
      pilotId,
      transactionAmount,
      description,
      PilotCreditTransactionTypeEnum.CREDIT,
      queryRunner,
    );
  }

  public async getPilotCurrentBalance(pilotId: number): Promise<number> {
    this.logger.log('Get pilot current balance');

    this.logger.log('Get pilot current balance');

    const result = await this.getEntityManager()
      .getRepository(PilotCreditTransactionEntity)
      .createQueryBuilder('c')
      .select('COALESCE(SUM(c.amount), 0)', 'currentBalance') // Use correct alias
      .where('c.pilotId = :pilotId', { pilotId })
      .getRawOne();

    return result ? parseFloat(result.currentBalance) : 0;
  }
}
