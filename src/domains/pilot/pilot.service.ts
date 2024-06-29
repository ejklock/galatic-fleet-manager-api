import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ApiPaginatedResponse } from '../common/common.types';
import { ShipEntity } from '../ship/ship.entity';
import { PilotEntity } from './pilot.entity';

@Injectable()
export class PilotService extends BaseService<PilotEntity> {
  constructor(
    @InjectRepository(PilotEntity)
    private readonly pilotRepository: Repository<PilotEntity>,
  ) {
    super(pilotRepository);
  }

  public async findOneWithCredits(id: number): Promise<PilotEntity> {
    this.logger.log(`Find one with credits ${id}`);
    const queryBuilder = this.repository
      .createQueryBuilder('pilots')
      .leftJoin('pilots.pilotCreditTransactions', 'pilotCreditTransactions')
      .addSelect([
        'COALESCE(SUM(pilotCreditTransactions.amount),0) AS pilots_credits',
      ])
      .groupBy('pilots.id')
      .where('pilots.id = :id', { id });
    return queryBuilder.getOne();
  }

  public async getAllPaginatedWithCredits(
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<PilotEntity>> {
    this.logger.log('Get all paginated with credits');
    const queryBuilder = this.repository
      .createQueryBuilder('pilots')
      .leftJoin('pilots.pilotCreditTransactions', 'pilotCreditTransactions')
      .addSelect([
        'COALESCE(SUM(pilotCreditTransactions.amount),0) AS pilots_credits',
      ])
      .groupBy('pilots.id')
      .orderBy('pilots.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return this.buildPaginationResponse(data, total, page, limit);
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

  private async validateIfShipsExists(ships?: number[]): Promise<void> {
    this.logger.log('Validate if ships exists');
    if (ships && ships.length !== 0) {
      const existentShips = await this.getEntityManager()
        .getRepository(ShipEntity)
        .createQueryBuilder('pilot_ships')
        .where('pilot_ships.id IN (:...ships)', { ships })
        .getMany();
      if (existentShips.length !== ships.length) {
        throw new Error('One or more ships do not exist');
      }
    }
  }

  public async storeWithShips(
    item: DeepPartial<PilotEntity>,
    ships?: number[],
  ): Promise<PilotEntity> {
    this.logger.log('Store with ships');
    await this.validateIfShipsExists(ships);
    return await this.executeInTransaction(async (queryRunner: QueryRunner) => {
      const pilot = await queryRunner.manager.save(PilotEntity, item);

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('pilot_ships', ['pilot_id', 'ship_id'])
        .values(ships.map((ship) => ({ pilotId: pilot.id, shipId: ship })))
        .execute();

      return pilot;
    });
  }
}
