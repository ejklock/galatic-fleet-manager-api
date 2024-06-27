import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('travels')
export class TravelEntity extends BaseEntity {
  @Column({ name: 'travel_config_id' })
  travelConfigId: number;

  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;
}
