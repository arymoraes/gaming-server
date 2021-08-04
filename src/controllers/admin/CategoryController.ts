import { Response } from 'express';
import GameCategory from '../../entities/GameCategory';
import { AuthRequest } from './../../middleware/admin';

class GameCategoryController {
  async addCategory (req: AuthRequest, res: Response) {
    try {
      const { name } = req.body;
      const gameCategory = GameCategory.create({
        name
      });
      await gameCategory.save();
      return res.status(200).json({
        name,
      });
    } catch (error) {
      return res.status(500).send({
        error,
      });
    }
  };

  async getCategories (req: AuthRequest, res: Response) {
    try {
      const categories = await GameCategory.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).send({
        error,
      });
    }
  }
}

export default new GameCategoryController();