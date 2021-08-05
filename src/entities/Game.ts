/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany, ManyToOne,
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

      @Column({
        nullable: true,
      })
      image: string;

      @ManyToMany(() => User)
      @JoinTable()
      users: User[];

      @ManyToOne(() => GameCategory, (category: GameCategory) => category.game)
      category: GameCategory;

      @OneToMany(() => Rank, (rank) => rank.game)
      rank: Rank[];
}
