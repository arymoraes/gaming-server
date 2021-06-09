/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
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

  // /user/register endpoint
  describe('User registration endpoint', () => {
    it('should create a new user', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.regular);
      expect(response.status).toBe(200);
      const user = await User.find({ username: 'test' });
      expect(user).toBeTruthy();
    });

    it('should not create if username is missing', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.noUsername);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if email is missing', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.noEmail);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if password is missing', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.noPassword);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if password length is incorrect', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.smallpassword);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if email does not match email regex', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.notAnEmail);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if user already exists', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.regular);
      expect(response.status).toBe(200);

      const secondResponse = await request.post('/user/register')
        .send(mockUser.sameUsername);
      expect(secondResponse.status).toBeGreaterThanOrEqual(400);
    });

    it('should not create if email already exists', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.regular);
      expect(response.status).toBe(200);

      const secondResponse = await request.post('/user/register')
        .send(mockUser.sameEmail);
      expect(secondResponse.status).toBeGreaterThanOrEqual(400);
    });
  });

  // /user/login endpoint
  describe('User login endpoint', () => {
    it('should login successfully with a valid user', async () => {
      await request.post('/user/register')
        .send(mockUser.regular);

      const response = await request.post('/user/login')
        .send({
          email: mockUser.regular.email,
          password: mockUser.regular.password,
        });
      expect(response.status).toBe(200);

      const jwtCheck = jwt.verify(response.body.token, process.env.SECRET_KEY);
      expect(jwtCheck).toBeTruthy();
    });

    it('should not login in case user does not exist', async () => {
      const response = await request.post('/user/login')
        .send({
          email: mockUser.regular.email,
          password: mockUser.regular.password,
        });
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should not login with incorrect password', async () => {
      await request.post('/user/register')
        .send(mockUser.regular);

      const response = await request.post('/user/login')
        .send({
          email: mockUser.regular.email,
          password: mockUser.smallpassword.password,
        });
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  // /user/me endpoint
  describe('/me endpoint', () => {
    it('should return user information with correct header', async () => {
      const response = await request.post('/user/register')
        .send(mockUser.regular);

      const meResponse = await request.get('/user/me')
        .set('Content-Type', 'application/json')
        .set('authorization', `Bearer ${response.body.token}`);

      expect(meResponse.status).toBe(200);
    });

    it('should not authorize in case of incorrect header', async () => {
      const response = await request.get('/user/me')
        .send({
          email: mockUser.regular.email,
          password: mockUser.regular.password,
        });
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
