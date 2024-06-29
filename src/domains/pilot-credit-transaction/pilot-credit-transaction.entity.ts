import { DecimalColumnTransformer } from 'src/utils/app.transformers';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { PilotEntity } from '../pilot/pilot.entity';
import { PilotCreditTransactionTypeEnum } from './pilot-credit-transaction.types';

@Entity('pilot_credit_transactions')
export class PilotCreditTransactionEntity extends BaseEntity {
  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({
    name: 'amount',
    type: 'decimal',
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ name: 'transaction_type', enum: PilotCreditTransactionTypeEnum })
  transactionType: PilotCreditTransactionTypeEnum;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => PilotEntity, (pilot) => pilot.pilotCreditTransactions)
  @JoinColumn({ name: 'pilot_id' })
  pilot: PilotEntity;
}
