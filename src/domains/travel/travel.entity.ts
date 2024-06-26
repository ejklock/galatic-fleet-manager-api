import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('travels')
export class TravelEntity extends BaseEntity {
  @Column({ name: 'travel_config_id' })
  travelConfigId: number;

  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;
}
