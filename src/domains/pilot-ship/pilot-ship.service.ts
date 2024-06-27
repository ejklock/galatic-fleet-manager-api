import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/utils/base-repository';
import { Repository } from 'typeorm';
import { PilotShipEntity } from './pilot-ship.entity';

@Injectable()
export class PilotShipService extends BaseRepository<PilotShipEntity> {
  constructor(
    @InjectRepository(PilotShipEntity)
    private readonly pilotShipRepository: Repository<PilotShipEntity>,
  ) {
    super(pilotShipRepository);
  }
}
