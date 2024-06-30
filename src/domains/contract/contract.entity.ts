import { Column, Entity, OneToMany } from 'typeorm';
import { DecimalColumnTransformer } from '../../utils/app.transformers';
import { BaseEntity } from '../common/base.entity';
import { ContractResourceEntity } from '../contract-resource/contract-resource.entity';
import { ContractStatusEnum } from './contract.types';

@Entity('contracts')
export class ContractEntity extends BaseEntity {
  @Column({ name: 'origin_planet_id' })
  originPlanetId: number;

  @Column({ name: 'destination_planet_id' })
  destinationPlanetId: number;

  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  value: number;

  @Column({
    type: 'enum',
    enum: ContractStatusEnum,
  })
  status: ContractStatusEnum;

  @Column({
    name: 'total_weight',
    select: false,
    insert: false,
    update: false,
    nullable: true,
    transformer: new DecimalColumnTransformer(),
  })
  totalWeight: number;

  @OneToMany(() => ContractResourceEntity, (resource) => resource.contract)
  payload: ContractResourceEntity[];
}
