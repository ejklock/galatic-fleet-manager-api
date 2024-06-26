import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('contract_resources')
export class ContractResourceEntity extends BaseEntity {
  @Column({ name: 'contract_id' })
  contractId: number;

  @Column({ name: 'resource_id' })
  resourceId: number;

  @Column()
  quantity: number;
}
