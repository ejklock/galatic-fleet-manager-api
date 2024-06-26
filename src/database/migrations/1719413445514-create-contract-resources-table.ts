import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateContractResourcesTable1719413445514
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contract_resources',
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
            name: 'resource_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('contract_resources', [
      new TableForeignKey({
        name: 'FK_CONTRACTS_RESOURCES',
        columnNames: ['contract_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contracts',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        name: 'FK_RESOURCES_CONTRACTS',
        columnNames: ['resource_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'resources',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contract_resources');
  }
}
