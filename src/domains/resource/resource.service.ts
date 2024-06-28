import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseService from '../common/base.service';
import { ResourceEntity } from './resource.entity';

@Injectable()
export class ResourceService extends BaseService<ResourceEntity> {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {
    super(resourceRepository);
  }
}
