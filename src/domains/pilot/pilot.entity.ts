import { DecimalColumnTransformer } from 'src/utils/app.transformers';

import { Column, Entity, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ShipEntity } from '../ship/ship.entity';

@Entity('pilots')
export class PilotEntity extends BaseEntity {
  @Column({ name: 'location_planet_id' })
  locationPlanetId: number;

  @Column()
  certification: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  credits: number;

  @JoinTable({
    name: 'pilots_ships',
    joinColumn: {
      name: 'pilot_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ship_id',
      referencedColumnName: 'id',
    },
  })
  ships: ShipEntity[];
}
