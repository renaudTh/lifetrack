import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecords1754731849788 implements MigrationInterface {
    name = 'AddRecords1754731849788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Records" ADD "userId" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Records" DROP COLUMN "userId"`);
    }

}
