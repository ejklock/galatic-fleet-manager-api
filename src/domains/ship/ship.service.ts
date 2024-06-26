import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/utils/base-repository';
import { Repository } from 'typeorm';
import { ShipEntity } from './ship.entity';

@Injectable()
export class ShipService extends BaseRepository<ShipEntity> {
  constructor(
    @InjectRepository(ShipEntity)
    private readonly shipRepository: Repository<ShipEntity>,
  ) {
    super(shipRepository);
  }
}
