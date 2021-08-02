/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne,
} from 'typeorm';
import Game from './Game';

  @Entity()
export default class Rank extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      name: string;

      @Column()
      order: number;

      @ManyToOne(() => Game, (game: Game) => game.rank)
      game: Game;
}
