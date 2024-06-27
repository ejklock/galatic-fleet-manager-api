import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePilotShipsTable1719441472495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pilot_ships',
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
            name: 'pilot_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'ship_id',
            unsigned: true,
            type: 'bigint',
            isUnique: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKeys('pilot_ships', [
      new TableForeignKey({
        name: 'FK_PILOT_SHIPS_PILOT',
        columnNames: ['pilot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pilots',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_PILOT_SHIPS_SHIP',
        columnNames: ['ship_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ships',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndex(
      'pilot_ships',
      new TableIndex({
        name: 'IDX_PILOT_SHIPS',
        isUnique: true,
        columnNames: ['pilot_id', 'ship_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pilot_ships', true, true, true);
  }
}
