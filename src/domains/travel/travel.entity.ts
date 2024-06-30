import { DecimalColumnTransformer } from 'src/utils/app.transformers';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('travels')
export class TravelEntity extends BaseEntity {
  @Column({ name: 'contract_id', nullable: true })
  contractId: number;

  @Column({ name: 'from_planet_id' })
  fromPlanetId: number;

  @Column({ name: 'to_planet_id' })
  toPlanetId: number;

  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  @Column({
    name: 'fuel_consumed',
    type: 'decimal',
    precision: 10,
    scale: 3,
    transformer: new DecimalColumnTransformer(),
  })
  fuelConsumed: number;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
