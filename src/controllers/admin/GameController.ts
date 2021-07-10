/* eslint-disable class-methods-use-this */
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import errorHandler from '../../utils/ErrorHandler';
import Game from '../../entities/Game';

class GameController {
  async addGame(req: Request, res: Response) {
    try {
      const { name, url } = req.body;

      if (!name) return errorHandler(res, 404, 'Missing params');

      const game = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Game)
        .values({
          name, url,
        })
        .execute();

      // TODO: Change this later to make it easier to return the object
      return res.status(200).json({
        name,
        url,
        id: game.raw[0].id,
      });
    } catch (err) {
      return errorHandler(res, 500, 'Server error');
    }
  }

  async deleteGame(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) return errorHandler(res, 404, 'Missing params');

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
