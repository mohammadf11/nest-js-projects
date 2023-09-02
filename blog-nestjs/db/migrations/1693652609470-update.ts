import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1693652609470 implements MigrationInterface {
    name = 'Update1693652609470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "editById" integer`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_15396f23bf44172f76e4dbb3e7b" FOREIGN KEY ("editById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_15396f23bf44172f76e4dbb3e7b"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "editById"`);
    }

}
