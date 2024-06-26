import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTravelConfigsTable1719415994453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO travel_configs (from_planet_id, to_planet_id, fuel_consumption) VALUES
            (1,3,13.0),
            (1,4,23.0),
            (2,3,22.0),
            (2,4,25.0),
            (3,2,30.0),
            (3,4,12.0),
            (4,1,20.0),
            (4,2,25.0),
            (4,3,15.0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM travel_configs;`);
  }
}
