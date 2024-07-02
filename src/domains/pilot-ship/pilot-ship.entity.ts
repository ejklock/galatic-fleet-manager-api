import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { PilotEntity } from '../pilot/pilot.entity';
import { ShipEntity } from '../ship/ship.entity';

@Entity('pilot_ships')
export class PilotShipEntity extends BaseEntity {
  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  @OneToOne(() => ShipEntity, (ship) => ship.id)
  @JoinColumn({ name: 'ship_id' })
  ship: ShipEntity;

  @OneToOne(() => PilotEntity, (pilot) => pilot.id)
  @JoinColumn({ name: 'pilot_id' })
  pilot: PilotEntity;
}
