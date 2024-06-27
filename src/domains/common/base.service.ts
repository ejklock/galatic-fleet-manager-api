import { Logger } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiPaginatedResponse } from './common.types';

export default class BaseService<T extends BaseEntity> {
  protected readonly logger: Logger;
  constructor(public repository: Repository<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  public findAll(): Promise<T[]> {
    this.logger.log('Find all');
    return this.repository.find();
  }

  public async getAllPaginated(
    page = 1,
    limit = 10,
    orderBy = 'id',
  ): Promise<ApiPaginatedResponse<T>> {
    this.logger.log('Get all paginated');
    const queryBuilder = this.repository.createQueryBuilder('qb');

    const [data, total] = await queryBuilder
      .orderBy(`qb.${orderBy}`, 'ASC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const firstPage = (page - 1) * limit + 1;

    return {
      data,
      links: {
        first: `?page=1&limit=${limit}`,
        last: `?page=${lastPage}&limit=${limit}`,
        prev:
          lastPage <= 1
            ? null
            : `?page=${page === 1 ? 1 : page - 1}&limit=${limit}`,
        next: lastPage <= 1 ? null : `?page=${page + 1}&limit=${limit}`,
      },
      meta: {
        firstPage,
        lastPage,
        total,
        currentPage: page,
      },
    };
  }

  public async findOne(id: number): Promise<T | null> {
    this.logger.log(`Find one ${id}`);
    const options: FindOneOptions<T> = {
      where: { id } as unknown as FindOneOptions<T>['where'],
    };
    return await this.repository.findOne(options);
  }

  public async store(item: DeepPartial<T>): Promise<T> {
    this.logger.log('Store');
    const createdItem = this.repository.create(item);
    return await this.repository.save(createdItem);
  }

  public async update(id: number, item: Partial<T>): Promise<T> {
    this.logger.log('Update');
    const itemToUpdate = await this.findOne(id);
    if (!itemToUpdate) {
      throw new Error('Item not found');
    }
    return await this.repository.save({ ...itemToUpdate, ...item });
  }

  public async remove(id: number): Promise<void> {
    this.logger.log('Remove');
    const item = await this.findOne(id);
    if (!item) {
      throw new Error('Item not found');
    }
    await this.repository.remove(item);
  }
}
