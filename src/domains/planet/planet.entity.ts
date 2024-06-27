import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('planets')
export class PlanetEntity extends BaseEntity {
  @Column()
  name: string;
}
