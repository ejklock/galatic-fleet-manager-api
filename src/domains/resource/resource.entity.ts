import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ContractResourceEntity } from '../contract-resource/contract-resource.entity';
import { ResourceTypeEnum } from './resource.types';

@Entity('resources')
export class ResourceEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ResourceTypeEnum })
  type: ResourceTypeEnum;

  @Column()
  weight: number;

  @OneToMany(
    () => ContractResourceEntity,
    (contractResource) => contractResource.resource,
  )
  @JoinColumn({ name: 'id' })
  contractResources: ContractResourceEntity[];
}
