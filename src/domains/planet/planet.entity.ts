import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('planets')
export class PlanetEntity extends BaseEntity {
  @Column()
  name: string;
}
