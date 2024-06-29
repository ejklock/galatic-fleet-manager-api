import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import BaseService from './base.service';

@Injectable()
export default class BaseEntityService extends BaseService<BaseEntity> {
  constructor(
    @InjectRepository(BaseEntity)
    baseEntityRepository: Repository<BaseEntity>,
  ) {
    super(baseEntityRepository);
  }
}
