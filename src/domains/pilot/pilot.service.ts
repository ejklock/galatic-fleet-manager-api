import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/utils/base-repository';
import { Repository } from 'typeorm';
import { PilotEntity } from './pilot.entity';

@Injectable()
export class PilotService extends BaseRepository<PilotEntity> {
  constructor(
    @InjectRepository(PilotEntity)
    private readonly pilotRepository: Repository<PilotEntity>,
  ) {
    super(pilotRepository);
  }
}
