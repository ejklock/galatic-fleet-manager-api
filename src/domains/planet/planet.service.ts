import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { PlanetEntity } from './planet.entity';

@Injectable()
export class PlanetService extends BaseService<PlanetEntity> {
  constructor(
    @InjectRepository(PlanetEntity)
    public readonly planetRepository: Repository<PlanetEntity>,
  ) {
    super(planetRepository);
  }
}
