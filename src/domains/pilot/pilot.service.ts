import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ApiPaginatedResponse } from '../common/common.types';
import { PilotShipService } from '../pilot-ship/pilot-ship.service';
import { ShipService } from '../ship/ship.service';
import { PilotEntity } from './pilot.entity';

@Injectable()
export class PilotService extends BaseService<PilotEntity> {
  constructor(
    @InjectRepository(PilotEntity)
    private readonly pilotRepository: Repository<PilotEntity>,
    private readonly shipService: ShipService,
    private readonly pilotShipService: PilotShipService,
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
    orderBy = 'id',
    orderWay: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ApiPaginatedResponse<PilotEntity>> {
    this.logger.log('Get all paginated with credits');
    const queryBuilder = this.repository
      .createQueryBuilder('pilots')
      .leftJoin('pilots.pilotCreditTransactions', 'pilotCreditTransactions')
      .addSelect([
        'COALESCE(SUM(pilotCreditTransactions.amount),0) AS pilots_credits',
      ])
      .groupBy('pilots.id')
      .orderBy(`pilots.${orderBy}`, orderWay)
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

  public async validatePilot(
    pilotId: number,
    queryRunner?: QueryRunner,
  ): Promise<PilotEntity> {
    this.logger.log('Validate pilot');

    const pilotRepository = queryRunner
      ? queryRunner.manager.getRepository(PilotEntity)
      : this.getEntityManager().getRepository(PilotEntity);

    const pilot = await pilotRepository.findOne({
      where: { id: pilotId },
    });
    if (!pilot) {
      throw new Error('Pilot does not exist');
    }
    return pilot;
  }

  public async storeWithShips(
    item: DeepPartial<PilotEntity>,
    ships?: number[],
  ): Promise<PilotEntity> {
    this.logger.log('Store with ships');
    await this.shipService.validateIfShipsExists(ships);
    return await this.executeInTransaction(async (queryRunner: QueryRunner) => {
      const pilot = await queryRunner.manager.save(PilotEntity, item);

      await this.pilotShipService.storePilotShips(pilot.id, ships, queryRunner);

      return pilot;
    });
  }
}
