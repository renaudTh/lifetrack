import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecords1754731315876 implements MigrationInterface {
    name = 'AddRecords1754731315876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Records" ("id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "count" integer NOT NULL, "activityId" uuid, CONSTRAINT "PK_3ed06ac9144a991f3f919629ba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Records" ADD CONSTRAINT "FK_48567bdaca7a9a7f4f47e5afb9d" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Records" DROP CONSTRAINT "FK_48567bdaca7a9a7f4f47e5afb9d"`);
        await queryRunner.query(`DROP TABLE "Records"`);
    }

}
