import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncEntities1789636074789 implements MigrationInterface {
  name = 'SyncEntities1789636074789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Activities" ADD "deleted_date" TIMESTAMP`,
    );
    // Converted in place: the DROP COLUMN + ADD that TypeORM generates would
    // lose the dates already recorded.
    await queryRunner.query(
      `ALTER TABLE "Records" ALTER COLUMN "date" TYPE date USING "date"::date`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_429bae619f5d6027dcd75f25f2" ON "Records" ("userId", "activityId", "date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_429bae619f5d6027dcd75f25f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Records" ALTER COLUMN "date" TYPE TIMESTAMP USING "date"::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "Activities" DROP COLUMN "deleted_date"`,
    );
  }
}
