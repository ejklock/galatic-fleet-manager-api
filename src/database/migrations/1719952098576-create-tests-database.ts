import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTestsDatabase1719952098576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase('galatic_fleet_manager_test', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('galatic_fleet_manager_test', true);
  }
}
