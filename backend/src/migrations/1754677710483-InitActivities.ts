import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitActivities1754677710483 implements MigrationInterface {
  name = 'InitActivities1754677710483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Activities" ("id" uuid NOT NULL, "owner_id" text NOT NULL, "representation" text NOT NULL, "unit" text NOT NULL, "description" text NOT NULL, "base_amount" numeric NOT NULL, CONSTRAINT "PK_68241637da2837e6d5a4db6f806" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Activities"`);
  }
}
