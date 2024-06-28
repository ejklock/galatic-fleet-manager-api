import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateContractsTable1719441472496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contracts',
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
            name: 'origin_planet_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'destination_planet_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'pilot_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'PENDING',
              'PENDING_RESOURCES',
              'ACCEPTED',
              'COMPLETED',
              'CANCELED',
              'REJECTED',
            ],
            default: "'PENDING_RESOURCES'",
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('contracts', [
      new TableForeignKey({
        name: 'FK_CONTRACTS_ORIGIN_PLANET',
        columnNames: ['origin_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_CONTRACTS_DESTINATION_PLANET',
        columnNames: ['destination_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_CONTRACTS_PILOT',
        columnNames: ['pilot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pilots',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contracts');
  }
}
