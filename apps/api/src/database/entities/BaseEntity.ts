import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BaseEntity,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

export abstract class BaseEntityWithTimeStamp extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  /**
   * Prefix for the ID. Should be overridden by child entities.
   */
  static prefix: string = 'base';

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      const prefix = (this.constructor as typeof BaseEntityWithTimeStamp).prefix;
      this.id = `${prefix}_${uuidv7()}`;
    }
  }
}
