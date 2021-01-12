import {MigrationInterface, QueryRunner} from "typeorm";

export class todo1572217891250 implements MigrationInterface {
    name = 'todo1572217891250'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "completed" boolean NOT NULL, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
    }

}
