/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import errorHandler from '../../utils/ErrorHandler';
import { AuthRequest } from '../../middleware/auth';
import { User } from '../../entities/User';
import { validateEmail } from '../../utils/ValidateEmail';

dotenv.config();

class AuthController {
  async register(req: Request, res: Response): Promise<any> {
    try {
      const {
        username, email, password, gender,
      } = req.body;

      if (!email || !username || !password) {
        return errorHandler(res, 400, 'Missing parameters');
      }

      if (password.length < 7 || password.length > 16) {
        return errorHandler(res, 400, 'Password should be between 8 and 16 characters');
      }

      if (!validateEmail(email)) {
        return errorHandler(res, 400, 'Invalid email');
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
      return null;
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await getConnection()
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) return errorHandler(res, 404, 'A user with this email does not exist');

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return errorHandler(res, 401, 'Invalid password');

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
        token,
      });
    } catch (err) {
      return errorHandler(res, 500, 'Server error');
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      const { user } = req;

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        user: {
          email: user.email,
          username: user.username,
          id: user.id,
          gender: user.gender,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

export default AuthController;
