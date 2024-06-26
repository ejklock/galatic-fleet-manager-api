import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedResourcesTable1719413318879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO resources (id, type, weight) VALUES
            (1, 'MINERALS', 10.0),
            (2, 'WATER', 1.0),
            (3, 'FOOD', 5.0);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM resources;`);
  }
}
