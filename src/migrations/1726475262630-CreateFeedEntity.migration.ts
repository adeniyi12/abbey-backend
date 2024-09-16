import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFeedEntity1726475262630 implements MigrationInterface {
    name = 'CreateFeedEntity1726475262630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feed_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "imageUrl" character varying, "category" character varying, "user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b404954315e5b75405ef543906a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feed_entity"`);
    }

}
