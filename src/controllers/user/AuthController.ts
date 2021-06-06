/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { Response } from 'express';
import { createQueryBuilder, getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import errorHandler from '../../utils/ErrorHandler';
import { AuthRequest } from '../../middleware/auth';
import { User } from '../../entities/User';

dotenv.config();

class AuthController {
  async register(req: AuthRequest, res: Response): Promise<any> {
    try {
      const {
        username, email, password, gender,
      } = req.body;

      if (!email || !username || !password) {
        return errorHandler(res, 400, 'Missing parameters');
      }

      const userExists = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.username = :username', { username })
        .orWhere('user.email = :email', { email })
        .getOne();

      if (userExists) {
        return errorHandler(res, 400, 'Username or Email already exists');
      }

      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return errorHandler(res, 401, 'There was some error with your password. Please, try again');
        }

        const user: any = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              username,
              email,
              password: hashedPassword,
              gender,
              resetPassword: null,
              isActive: true,
            },
          ])
          .execute();

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
          expiresIn: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
          user: {
            username,
            email,
            role: user.role,
          },
          token,
        });
      });
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

export default AuthController;
