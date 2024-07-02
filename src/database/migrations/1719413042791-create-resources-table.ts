import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ResourceTypeEnum } from '../../domains/resource/resource.types';

export class CreateResourcesTable1719413042791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resources',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              ResourceTypeEnum.MINERALS,
              ResourceTypeEnum.WATER,
              ResourceTypeEnum.FOOD,
            ],
            isUnique: true,
          },
          {
            name: 'weight',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('resources');
  }
}
