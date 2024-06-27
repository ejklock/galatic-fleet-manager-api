import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ShipEntity } from './ship.entity';

@Injectable()
export class ShipService extends BaseService<ShipEntity> {
  constructor(
    @InjectRepository(ShipEntity)
    private readonly shipRepository: Repository<ShipEntity>,
  ) {
    super(shipRepository);
  }
}
