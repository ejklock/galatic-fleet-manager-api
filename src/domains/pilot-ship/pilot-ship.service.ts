import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { PilotShipEntity } from './pilot-ship.entity';

@Injectable()
export class PilotShipService extends BaseService<PilotShipEntity> {
  constructor(
    @InjectRepository(PilotShipEntity)
    private readonly pilotShipRepository: Repository<PilotShipEntity>,
  ) {
    super(pilotShipRepository);
  }

  public async storePilotShips(
    pilotId: number,
    ships: number[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('Store pilot ships');

    const repository = queryRunner
      ? queryRunner.manager.getRepository(PilotShipEntity)
      : this.getEntityManager().getRepository(PilotShipEntity);

    await repository
      .createQueryBuilder()
      .insert()
      .into('pilot_ships', ['pilot_id', 'ship_id'])
      .values(ships.map((ship) => ({ pilotId, shipId: ship })))
      .execute();
  }
}
