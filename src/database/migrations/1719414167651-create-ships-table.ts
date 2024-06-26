import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShipsTable1719414167651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ships',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fuel_level',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'fuel_capacity',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'weight_capacity',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ships');
  }
}
