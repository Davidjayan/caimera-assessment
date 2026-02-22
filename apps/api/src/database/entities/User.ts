import { Entity, Column } from 'typeorm';
import { BaseEntityWithTimeStamp } from './BaseEntity';

@Entity()
export class User extends BaseEntityWithTimeStamp {
  static override prefix = 'usr';

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;
}
