import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecords1754731849788 implements MigrationInterface {
  name = 'AddRecords1754731849788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajout en nullable puis backfill : un ADD ... NOT NULL sans DEFAULT echoue
    // des que la table contient deja des lignes.
    await queryRunner.query(`ALTER TABLE "Records" ADD "userId" text`);
    await queryRunner.query(
      `UPDATE "Records" SET "userId" = "Activities"."owner_id"
         FROM "Activities"
        WHERE "Records"."activityId" = "Activities"."id"
          AND "Records"."userId" IS NULL`,
    );
    // Un record sans activite rattachee n'a pas de proprietaire identifiable.
    await queryRunner.query(`DELETE FROM "Records" WHERE "userId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "Records" ALTER COLUMN "userId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Records" DROP COLUMN "userId"`);
  }
}
