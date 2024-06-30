import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateShipFuelTransactionsTable1719627771378
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ship_fuel_transactions',
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
            name: 'ship_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'transaction_type',
            type: 'enum',
            enum: ['CREDIT', 'DEBIT'],
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'ship_fuel_transactions',
      new TableForeignKey({
        name: 'FK_SHIP_FUEL_TRANSACTIONS_SHIP',
        columnNames: ['ship_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ships',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ship_fuel_transactions');
  }
}
