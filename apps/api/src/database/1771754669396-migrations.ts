import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1771754669396 implements MigrationInterface {
    name = 'Migrations1771754669396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "playerId" character varying NOT NULL, "playerName" character varying NOT NULL, "questionId" character varying NOT NULL, "answer" character varying NOT NULL, "isCorrect" boolean NOT NULL, "gameSessionId" character varying, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "question" character varying NOT NULL, "options" json NOT NULL, "correctAnswer" character varying NOT NULL, "difficulty" character varying NOT NULL DEFAULT 'easy', "state" character varying NOT NULL DEFAULT 'open', "gameSessionId" character varying, "winnerId" character varying, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
    }

}
