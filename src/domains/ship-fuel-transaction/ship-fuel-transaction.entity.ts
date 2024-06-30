import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ShipEntity } from '../ship/ship.entity';
import { ShipFuelTransactionTypeEnum } from './ship-fuel-transaction.types';

@Entity('ship_fuel_transactions')
export class ShipFuelTransactionEntity extends BaseEntity {
  @Column({ name: 'ship_id' })
  shipId: number;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'transaction_type', enum: ShipFuelTransactionTypeEnum })
  transactionType: ShipFuelTransactionTypeEnum;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => ShipEntity, (ship) => ship.shipFuelTransactions)
  @JoinColumn({ name: 'ship_id' })
  ship: ShipEntity;
}
