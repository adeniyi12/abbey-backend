import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationshipEntity1726345275918 implements MigrationInterface {
    name = 'CreateRelationshipEntity1726345275918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "relationship_entity" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "friend_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dd20abf1712c9a07fe70a635c5f" UNIQUE ("user_id", "friend_id"), CONSTRAINT "PK_ddc095ced421a1a20ac85b2778d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "relationship_entity"`);
    }

}
