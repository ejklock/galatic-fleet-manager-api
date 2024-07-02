import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('federation_transactions_ledger')
export class FederationTransactionLedgerEntity extends BaseEntity {
  @Column({ name: 'description' })
  description: string;

  @Column({ default: 'now()', type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
