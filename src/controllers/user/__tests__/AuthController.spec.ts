/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';
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
    // Clear DB
    await getConnection().dropDatabase();
  });

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
