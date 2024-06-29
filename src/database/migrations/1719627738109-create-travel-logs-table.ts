import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTravelLogsTable1719627738109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'travel_logs',
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
            name: 'contract_id',
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
          {
            name: 'from_planet_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'to_planet_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'departure_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'arrival_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('travel_logs', [
      new TableForeignKey({
        name: 'FK_TRAVEL_LOGS_PILOT',
        columnNames: ['pilot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pilots',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVEL_LOGS_SHIP',
        columnNames: ['ship_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ships',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVEL_LOGS_FROM_PLANET',
        columnNames: ['from_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVEL_LOGS_TO_PLANET',
        columnNames: ['to_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVEL_LOGS_CONTRACT',
        columnNames: ['contract_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contracts',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('travel_logs');
  }
}
