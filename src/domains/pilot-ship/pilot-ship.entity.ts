import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('pilot_ships')
export class PilotShipEntity extends BaseEntity {
  @Column({ name: 'pilot_id' })
  pilotId: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  // @OneToOne(() => PilotEntity, (pilot) => pilot.id)
  // pilot: PilotEntity;
}
