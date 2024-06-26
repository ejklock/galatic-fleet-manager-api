import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePilotsTable1719413649178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pilots',
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
            name: 'location_planet_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'certification',
            type: 'varchar',
            length: '7',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'age',
            unsigned: true,
            type: 'tinyint',
          },
          {
            name: 'credits',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'pilots',
      new TableForeignKey({
        name: 'FK_PILOTS_LOCATION_PLANET',
        columnNames: ['location_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pilots');
  }
}
