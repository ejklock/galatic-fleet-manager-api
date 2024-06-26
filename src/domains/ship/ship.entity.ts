import { DecimalColumnTransformer } from 'src/utils/app.transformers';
import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

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
    name: 'fuel_level',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  fuelLevel: number;

  @Column({
    name: 'weight_capacity',
    type: 'decimal',
    precision: 10,
    scale: 3,
    transformer: new DecimalColumnTransformer(),
  })
  weightCapacity: number;
}
