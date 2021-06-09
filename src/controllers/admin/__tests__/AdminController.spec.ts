/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import Game from '../../../entities/Game';
import GameCategory from '../../../entities/GameCategory';
import Region from '../../../entities/Region';
import Style from '../../../entities/Style';
import { User } from '../../../entities/User';
import app from '../../../index';
import { mockUser } from './mocks';

const request = supertest(app);
dotenv.config();

describe('It should work with /user endpoint', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'postgres',
      host: process.env.TEST_DB_HOST,
      port: parseInt(process.env.TEST_DB_PORT, 10) || 5432,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
      entities: [User, Game, GameCategory, Region, Style],
      synchronize: true, // DO NOT USE FOR PRODUCTION! USE MIGRATIONS INSTEAD
    });
  });

  beforeEach(async () => {
    await getConnection().synchronize(true);
  });

  afterEach(async () => {
    await getConnection().dropDatabase();
  });

  describe('Adding a user endpoint', () => {
    it('an admin should be able to add an admin user', async () => {
      const admin = await User.create(mockUser.admin);

      const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      const response = await request.post('/admin/user/register')
        .send(mockUser.secondAdmin)
        .set('authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      const user = await User.find({ username: mockUser.secondAdmin.username });
      expect(user).toBeTruthy();
    });

    it('an admin should be able to add a regular user', async () => {
      const admin = await User.create(mockUser.admin);

      const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      const response = await request.post('/admin/user/register')
        .send(mockUser.regular)
        .set('authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      const user = await User.find({ username: mockUser.regular.username });
      expect(user).toBeTruthy();
    });

    it('a regular user should not be able to create an admin or a regular user', async () => {
      const admin = await User.create(mockUser.admin);

      const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      const response = await request.post('/admin/user/register')
        .send(mockUser.secondAdmin)
        .set('authorization', `Bearer ${token}`);
      expect(response.status).toBeGreaterThanOrEqual(400);

      const response2 = await request.post('/admin/user/register')
        .send(mockUser.regular)
        .set('authorization', `Bearer ${token}`);
      expect(response2.status).toBeGreaterThanOrEqual(400);
    });
  });
});
