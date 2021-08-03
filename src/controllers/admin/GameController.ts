/* eslint-disable class-methods-use-this */
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import errorHandler from '../../utils/ErrorHandler';
import Game from '../../entities/Game';
import GameCategory from '../../entities/GameCategory';
import Rank from '../../entities/Rank';

class GameController {
  async addGame(req: Request, res: Response) {
    try {
      const { name, url, categories, ranks } = req.body;

      if (!name) return errorHandler(res, 404, 'Missing params');
      let categoriesModels: GameCategory[] = [];
      if (categories && categories.length) {
        categoriesModels = await GameCategory.findByIds(categories);
      }

      const game = Game.create({
        name, url,
      });
      game.categories = categoriesModels;
      await game.save();

      const ranksArray = await Promise.all(ranks.map(async (rank: any, index: number) => {
        const singleRank: Rank = Rank.create({
          name: rank,
          game: game,
          order: index+1,
        });
        await singleRank.save();
        return singleRank;
      }));


      // TODO: Change this later to make it easier to return the object
      return res.status(200).json({
        name,
        url,
        id: game.id,
        ranks: ranksArray,
        categories,
      });
    } catch (err) {
      console.log(err);
      return errorHandler(res, 500, 'Server error');
    }
  }

  async getGames(_: Request, res: Response) {
    try {
      const games = await Game.find({ relations: ['categories', 'rank'] });
      return res.status(200).json(games);
    } catch (err) {
      console.log(err);
      return errorHandler(res, 500, 'Server error');
    }
  }

  async deleteGame(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) return errorHandler(res, 404, 'Missing params');

      // TODO: Find out how to delete-cascade
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Game)
        .where('id = :id', { id: 1 })
        .execute();

      return res.status(200).json({
        success: 'Game deleted successfully',
        id,
      });
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

export default new GameController();
