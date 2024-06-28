import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ContractEntity } from '../contract/contract.entity';
import { ResourceEntity } from '../resource/resource.entity';

@Entity('contract_resources')
export class ContractResourceEntity extends BaseEntity {
  @Column({ name: 'contract_id' })
  contractId: number;

  @Column({ name: 'resource_id' })
  resourceId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ContractEntity, (contract) => contract.contractResources)
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;

  @ManyToOne(() => ResourceEntity, (resource) => resource.contractResources)
  @JoinColumn({ name: 'resource_id' })
  resource: ResourceEntity;
}
