import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTravelsTable1719423311248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'travels',
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
            name: 'travel_config_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'pilot_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'ship_id',
            type: 'bigint',
            unsigned: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('travels', [
      new TableForeignKey({
        name: 'FK_TRAVELS_TRAVEL_CONFIGS',
        columnNames: ['travel_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'travel_configs',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVELS_PILOTS',
        columnNames: ['pilot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pilots',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVELS_SHIPS',
        columnNames: ['ship_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ships',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('travels');
  }
}
