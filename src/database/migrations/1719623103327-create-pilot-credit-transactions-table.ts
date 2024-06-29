import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePilotCreditTransactionsTable1719623103327
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pilot_credit_transactions',
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
            name: 'pilot_id',
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
            name: 'transaction_type',
            type: 'enum',
            enum: ['CREDIT', 'DEBIT'],
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
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
      'pilot_credit_transactions',
      new TableForeignKey({
        name: 'FK_CREDIT_TRANSACTIONS_PILOT',
        columnNames: ['pilot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pilots',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pilot_credit_transactions', true, true, true);
  }
}
