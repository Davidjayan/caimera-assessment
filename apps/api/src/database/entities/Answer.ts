import { Entity, Column } from 'typeorm';
import { BaseEntityWithTimeStamp } from './BaseEntity';

@Entity()
export class Answer extends BaseEntityWithTimeStamp {
  static override prefix = 'ans';

  @Column()
  playerId!: string;

  @Column()
  playerName!: string;

  @Column()
  questionId!: string;

  @Column()
  answer!: string;

  @Column()
  isCorrect!: boolean;

  @Column({ nullable: true })
  gameSessionId?: string;
}
