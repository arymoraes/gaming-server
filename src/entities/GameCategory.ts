/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinTable, ManyToOne, ManyToMany,
} from 'typeorm';
import Game from './Game';

  @Entity()
export default class GameCategory extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @ManyToMany(() => Game)
      @JoinTable()
      games: Game[];
}
