/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { User } from './User';

  @Entity()
export default class Game extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({
        unique: true,
      })
      name: string;

      @Column({
        nullable: true,
      })
      url: string;

      @ManyToMany(() => User)
      @JoinTable()
      users: User[];

  // Add categories later
}