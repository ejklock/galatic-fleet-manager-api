import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTravelConfigsTable1719414458648
  implements MigrationInterface
{
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'travel_configs',
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
            name: 'fuel_consumption',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
          {
            name: 'hash_value',
            type: 'varchar',
            length: '32',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('travel_configs', [
      new TableForeignKey({
        name: 'FK_TRAVEL_CONFIGS_FROM_PLANET',
        columnNames: ['from_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        name: 'FK_TRAVEL_CONFIGS_TO_PLANET',
        columnNames: ['to_planet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'planets',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndex(
      'travel_configs',
      new TableIndex({
        name: 'IDX_FROM_PLANET_TO_PLANET_ID',
        columnNames: ['hash_value'],
        isUnique: true,
      }),
    );

    await queryRunner.query(`
      CREATE FUNCTION calculate_hash(from_id BIGINT, to_id BIGINT) RETURNS VARCHAR(32)
      DETERMINISTIC
      BEGIN
        RETURN MD5(CONCAT(from_id, '::', to_id));
      END;

    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_insert_unique_hash
      BEFORE INSERT ON travel_configs
      FOR EACH ROW
      BEGIN
        SET NEW.hash_value = calculate_hash(NEW.from_planet_id, NEW.to_planet_id);
      END;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_update_unique_hash
      BEFORE UPDATE ON travel_configs
      FOR EACH ROW
      BEGIN
        SET NEW.hash_value = calculate_hash(NEW.from_planet_id, NEW.to_planet_id);
      END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_insert_unique_hash`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_update_unique_hash`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_hash`);
    await queryRunner.dropTable('travel_configs');
  }
}
