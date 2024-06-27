import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('pilot_ships')
export class PilotShipEntity extends BaseEntity {
  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  // @OneToOne(() => PilotEntity, (pilot) => pilot.id)
  // pilot: PilotEntity;
}
