import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTravelsTable1719441472497 implements MigrationInterface {
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
            name: 'contract_id',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
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
            name: 'fuel_consumed',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('travels', [
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
      new TableForeignKey({
        name: 'FK_TRAVELS_FROM_PLANET',
        columnNames: ['from_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVELS_TO_PLANET',
        columnNames: ['to_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_TRAVELS_CONTRACT',
        columnNames: ['contract_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contracts',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('travels');
  }
}
