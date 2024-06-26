import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';
import { ResourceTypeEnum } from './resource.types';

@Entity('resources')
export class ResourceEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ResourceTypeEnum })
  type: ResourceTypeEnum;

  @Column()
  weight: number;
}
