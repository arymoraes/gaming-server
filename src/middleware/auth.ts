/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createQueryBuilder } from 'typeorm';

export interface AuthRequest extends Request {
  user: any;
}

dotenv.config();

const authMiddleware = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new Error('Header does not exist');

    const [, token] = authHeader.split(' ');

    const jwtCheck: any = jwt.verify(token, process.env.SECRET_KEY);

    const user = await createQueryBuilder('user')
      .where('id = :id', { id: jwtCheck.id })
      .getOne();

    if (!user) throw new Error('Invalid user');

    req.user = user;

    next();
  } catch (error) {
    console.error(`Unauthorized route use: ${error}`);
    res.status(403).json({ error });
  }
};

export default authMiddleware;
