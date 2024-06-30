import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ShipFuelTransactionEntity } from './ship-fuel-transaction.entity';
import { ShipFuelTransactionTypeEnum } from './ship-fuel-transaction.types';

@Injectable()
export class ShipFuelTransactionService extends BaseService<ShipFuelTransactionEntity> {
  constructor(
    @InjectRepository(ShipFuelTransactionEntity)
    private readonly shipFuelTransactionRepository: Repository<ShipFuelTransactionEntity>,
  ) {
    super(shipFuelTransactionRepository);
  }

  protected async createTransaction(
    shipId: number,
    transactionAmount: number,
    transactionDescription: string,
    transactionType: ShipFuelTransactionTypeEnum,
    queryRunner?: QueryRunner,
  ) {
    this.logger.log(`Create ship ${transactionType} transaction`);

    await this.getRepository(ShipFuelTransactionEntity, queryRunner).save({
      shipId,
      description: transactionDescription,
      amount:
        transactionType === ShipFuelTransactionTypeEnum.DEBIT
          ? -transactionAmount
          : transactionAmount,
      type: transactionType,
    });
  }

  public async createShipDebitTransaction(
    shipId: number,
    description: string,
    transactionAmount: number,
    queryRunner?: QueryRunner,
  ) {
    await this.createTransaction(
      shipId,
      transactionAmount,
      description,
      ShipFuelTransactionTypeEnum.DEBIT,
      queryRunner,
    );
  }

  public async createShipCreditTransaction(
    pilotId: number,
    description: string,
    transactionAmount: number,
    queryRunner?: QueryRunner,
  ) {
    await this.createTransaction(
      pilotId,
      transactionAmount,
      description,
      ShipFuelTransactionTypeEnum.CREDIT,
      queryRunner,
    );
  }
}
