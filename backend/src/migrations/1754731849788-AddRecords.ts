import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecords1754731849788 implements MigrationInterface {
  name = 'AddRecords1754731849788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Added as nullable then backfilled: ADD ... NOT NULL without a DEFAULT
    // fails as soon as the table holds rows.
    await queryRunner.query(`ALTER TABLE "Records" ADD "userId" text`);
    await queryRunner.query(
      `UPDATE "Records" SET "userId" = "Activities"."owner_id"
         FROM "Activities"
        WHERE "Records"."activityId" = "Activities"."id"
          AND "Records"."userId" IS NULL`,
    );
    // A record with no linked activity has no identifiable owner.
    await queryRunner.query(`DELETE FROM "Records" WHERE "userId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "Records" ALTER COLUMN "userId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Records" DROP COLUMN "userId"`);
  }
}
