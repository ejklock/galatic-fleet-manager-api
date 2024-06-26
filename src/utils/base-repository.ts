import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  protected repository: Repository<T>;
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public getRepository(): Repository<T> {
    return this.repository;
  }
  public findAll(): Promise<T[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<T | null> {
    const options: FindOneOptions<T> = {
      where: { id } as unknown as FindOneOptions<T>['where'],
    };
    return await this.repository.findOne(options);
  }

  public async store(item: DeepPartial<T>): Promise<T> {
    const createdItem = this.repository.create(item);
    return await this.repository.save(createdItem);
  }

  public async update(id: number, item: Partial<T>): Promise<T> {
    const itemToUpdate = await this.findOne(id);
    if (!itemToUpdate) {
      throw new Error('Item not found');
    }
    return await this.repository.save({ ...itemToUpdate, ...item });
  }

  public async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    if (!item) {
      throw new Error('Item not found');
    }
    await this.repository.remove(item);
  }
}
