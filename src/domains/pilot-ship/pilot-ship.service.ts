import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
