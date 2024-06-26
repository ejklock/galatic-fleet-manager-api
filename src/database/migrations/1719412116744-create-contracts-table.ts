import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateContractsTable1719412116744 implements MigrationInterface {
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
            name: 'originPlanetId',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'contracts',
      new TableForeignKey({
        name: 'FK_CONTRACTS_ORIGIN_PLANET',
        columnNames: ['originPlanetId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
