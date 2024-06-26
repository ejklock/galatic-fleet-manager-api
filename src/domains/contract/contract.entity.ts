import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('contracts')
export class ContractEntity extends BaseEntity {
  @Column({ name: 'origin_planet_id' })
  originPlanetId: number;

  @Column()
  description: string;
}
