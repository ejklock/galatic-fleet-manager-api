import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { TravelConfigEntity } from './travel-config.entity';

@Injectable()
export class TravelConfigService extends BaseService<TravelConfigEntity> {
  constructor(
    @InjectRepository(TravelConfigEntity)
    private readonly travelConfigRepository: Repository<TravelConfigEntity>,
    private readonly dataSource: DataSource,
  ) {
    super(travelConfigRepository);
  }

  public async validateTravelConfig(
    originPlanetId: number,
    destinationPlanetId: number,
    queryRunner?: QueryRunner,
  ): Promise<TravelConfigEntity> {
    this.logger.log('Validate travel config');
    const travelConfigRepository = queryRunner
      ? queryRunner.manager.getRepository(TravelConfigEntity)
      : this.getEntityManager().getRepository(TravelConfigEntity);

    const travelConfig = await travelConfigRepository.findOne({
      where: {
        fromPlanetId: originPlanetId,
        toPlanetId: destinationPlanetId,
      },
    });

    if (!travelConfig) {
      throw new DomainRuleViolationException(
        `Travel from planet:${originPlanetId} to planet:${destinationPlanetId} is not valid. Configure the travel in the travel-configs endpoint`,
      );
    }
    return travelConfig;
  }
}
