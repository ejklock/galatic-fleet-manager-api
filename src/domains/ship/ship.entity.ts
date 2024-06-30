import { Column, Entity, OneToMany } from 'typeorm';
import { DecimalColumnTransformer } from '../../utils/app.transformers';
import { BaseEntity } from '../common/base.entity';
import { PilotShipEntity } from '../pilot-ship/pilot-ship.entity';
import { ShipFuelTransactionEntity } from '../ship-fuel-transaction/ship-fuel-transaction.entity';

@Entity('ships')
export class ShipEntity extends BaseEntity {
  @Column({
    name: 'fuel_capacity',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  fuelCapacity: number;

  @Column({
    name: 'weight_capacity',
    type: 'decimal',
    precision: 10,
    scale: 3,
    transformer: new DecimalColumnTransformer(),
  })
  weightCapacity: number;

  @Column({
    select: false,
    update: false,
    insert: false,
    nullable: true,
    name: 'fuel_level',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  fuelLevel: number;

  @OneToMany(() => ShipFuelTransactionEntity, (resource) => resource.ship)
  shipFuelTransactions: ShipFuelTransactionEntity[];

  @OneToMany(() => PilotShipEntity, (pilotShip) => pilotShip.ship)
  pilotShip: PilotShipEntity;
}
