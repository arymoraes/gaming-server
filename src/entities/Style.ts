/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { User } from './User';

  @Entity()
export default class Style extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @ManyToMany(() => User)
      @JoinTable()
      users: User[];
}
