import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, DeepPartial, QueryFailedError, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ShipEntity } from '../ship/ship.entity';
import { PilotEntity } from './pilot.entity';

@Injectable()
export class PilotService extends BaseService<PilotEntity> {
  constructor(
    @InjectRepository(PilotEntity)
    private readonly pilotRepository: Repository<PilotEntity>,
    private readonly dataSource: DataSource,
  ) {
    super(pilotRepository);
  }

  public async findByCertification(
    certification: string,
  ): Promise<PilotEntity> {
    this.logger.log(`Find by certification ${certification}`);
    return this.repository.findOneBy({ certification });
  }

  public async findOtherPilotWithCertification(
    idToUpdate: number,
    certification: string,
  ): Promise<PilotEntity> {
    this.logger.log('Find other pilot with certification');
    return this.repository
      .createQueryBuilder('pilot')
      .where('pilot.certification = :certification', { certification })
      .andWhere('pilot.id != :idToUpdate', { idToUpdate })
      .getOne();
  }

  private async validateIfShipsExists(ships: number[]): Promise<void> {
    this.logger.log('Validate if ships exists');
    const existentShips = await this.dataSource
      .getRepository(ShipEntity)
      .createQueryBuilder('pilot_ships')
      .where('pilot_ships.id IN (:...ships)', { ships })
      .getMany();
    if (existentShips.length !== ships.length) {
      throw new Error('One or more ships do not exist');
    }
  }

  public async storeWithShips(
    item: DeepPartial<PilotEntity>,
    ships?: number[],
  ): Promise<PilotEntity> {
    this.logger.log('Store with ships');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pilot = queryRunner.manager.create(PilotEntity, item);
      await queryRunner.manager.save(pilot);

      if (ships && ships.length !== 0) {
        await this.validateIfShipsExists(ships);
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('pilot_ships', ['pilot_id', 'ship_id'])
          .values(ships.map((ship) => ({ pilotId: pilot.id, shipId: ship })))
          .execute();
      }
      await queryRunner.commitTransaction();
      return pilot;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        switch (error.driverError.code) {
          case 'ER_DUP_ENTRY':
            throw new Error('Ship or pilot already exists');
          default:
            break;
        }
      }
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
}
