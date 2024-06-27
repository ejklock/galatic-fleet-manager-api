import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('contract_resources')
export class ContractResourceEntity extends BaseEntity {
  @Column({ name: 'contract_id' })
  contractId: number;

  @Column({ name: 'resource_id' })
  resourceId: number;

  @Column()
  quantity: number;
}
