import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/utils/base-repository';
import { Repository } from 'typeorm';
import { PlanetEntity } from './planet.entity';

@Injectable()
export class PlanetService extends BaseRepository<PlanetEntity> {
  constructor(
    @InjectRepository(PlanetEntity)
    private readonly planetRepository: Repository<PlanetEntity>,
  ) {
    super(planetRepository);
  }
}
