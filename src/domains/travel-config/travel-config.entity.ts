import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('travel_configs')
export class TravelConfigEntity extends BaseEntity {
  @Column({ name: 'from_planet_id' })
  fromPlanetId: number;

  @Column({ name: 'to_planet_id' })
  toPlanetId: number;

  @Column({ name: 'fuel_consumption' })
  fuelConsumption: number;
}
