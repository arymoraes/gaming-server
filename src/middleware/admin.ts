/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserRole } from '../entities/User';

export interface AuthRequest extends Request {
  user: any;
}

dotenv.config();

const adminAuthMiddleware = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).send({
        error: 'Unauthorized, user not an admin',
      });
    }

    next();
  } catch (error) {
    console.error(`Server Error: ${error}`);
    res.status(500).json({ error });
  }
};

export default adminAuthMiddleware;
