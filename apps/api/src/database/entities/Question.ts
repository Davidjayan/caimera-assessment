import { Entity, Column } from 'typeorm';
import { BaseEntityWithTimeStamp } from './BaseEntity';

export type QuestionState = 'open' | 'closed';

@Entity()
export class Question extends BaseEntityWithTimeStamp {
  static override prefix = 'qst';

  @Column()
  question!: string;

  @Column('json')
  options!: string[];

  @Column()
  correctAnswer!: string;

  @Column({ default: 'easy' })
  difficulty!: string;

  @Column({ default: 'open' })
  state!: QuestionState;

  @Column({ nullable: true })
  gameSessionId?: string;

  @Column({ nullable: true })
  winnerId?: string;
}
