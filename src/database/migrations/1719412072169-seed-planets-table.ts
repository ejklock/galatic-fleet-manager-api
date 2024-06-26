import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPlanetsTable1719412072169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO planets (id, name) VALUES
            (1, 'Andvari'),
            (2, 'Demeter'),
            (3, 'Aqua'),
            (4, 'Calas');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM planets;`);
  }
}
