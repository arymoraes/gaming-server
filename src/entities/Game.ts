/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany,
} from 'typeorm';
import GameCategory from './GameCategory';
import Rank from './Rank';
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

      @ManyToMany(() => GameCategory)
      @JoinTable()
      categories: GameCategory[];

      @OneToMany(() => Rank, (rank) => rank.game)
      rank: Rank[];
}
