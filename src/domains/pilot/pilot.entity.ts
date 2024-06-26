import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

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

  @Column()
  credits: number;
}
