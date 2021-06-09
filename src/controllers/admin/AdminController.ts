/* eslint-disable class-methods-use-this */
import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import errorHandler from '../../utils/ErrorHandler';
import { validateEmail } from '../../utils/ValidateEmail';
import { User } from '../../entities/User';

dotenv.config();

class AdminController {
  async addUser(req: Request, res: Response) {
    try {
      const {
        username, email, password, gender, role,
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
              role,
            },
          ])
          .execute();

        return res.status(200).json(user);
      });
      return null;
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

export default AdminController;
