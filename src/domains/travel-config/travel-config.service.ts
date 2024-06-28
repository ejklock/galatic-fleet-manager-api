import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import BaseService from '../common/base.service';
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
}
