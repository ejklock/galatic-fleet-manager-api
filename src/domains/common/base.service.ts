import { Logger } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiPaginatedResponse } from './common.types';

export default class BaseService<T extends BaseEntity> {
  protected readonly logger: Logger;
  constructor(public repository: Repository<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  public getEntityManager(): EntityManager {
    return this.repository.manager;
  }

  public getRepository(
    targetEntity: EntityTarget<T>,
    queryRunner?: QueryRunner,
  ): Repository<T> {
    return queryRunner
      ? queryRunner.manager.getRepository(targetEntity)
      : this.getEntityManager().getRepository(this.repository.target);
  }
  public getNewQueryRunner(): QueryRunner {
    return this.repository.manager.connection.createQueryRunner();
  }

  protected async executeInTransaction<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ) {
    this.logger.log('Starting transaction');
    const queryRunner = this.getNewQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      this.logger.log('Releasing query runner');
      await queryRunner.release();
    }
  }

  protected buildPaginationResponse(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): ApiPaginatedResponse<T> {
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
        total,
        currentPage: page,
        lastPage,
        firstPage,
      },
    };
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

    return this.buildPaginationResponse(data, total, page, limit);
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
