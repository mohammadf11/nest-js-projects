import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleTBL1693613901066 implements MigrationInterface {
    name = 'UpdateArticleTBL1693613901066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "slug" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "body" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "body" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"`);
    }

}
