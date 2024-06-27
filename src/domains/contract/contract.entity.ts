import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: ContractStatusEnum,
  })
  status: ContractStatusEnum;
}
