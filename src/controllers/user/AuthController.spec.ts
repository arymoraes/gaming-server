/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';
import Game from '../../entities/Game';
import GameCategory from '../../entities/GameCategory';
import Region from '../../entities/Region';
import Style from '../../entities/Style';
import { User } from '../../entities/User';
import app from '../../index';

// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');

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
      .send({
        username: 'test',
        password: 'test',
        email: 'test@test.com',
      });
    expect(response.status).toBe(200);

    const user = await User.find({ username: 'test' });

    expect(user).toBeTruthy();
  });

  it('should not create if username is missing', async () => {
    const response = await request.post('/user/register')
      .send({
        password: 'test',
        email: 'test@test.com',
      });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if email is missing', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'test',
      });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if password is missing', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        email: 'test@test.com',
      });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if password length is incorrect', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'small',
        email: 'test@test.com',
      });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if email does not match email regex', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'small',
        email: 'testtesttest',
      });
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if user already exists', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'small',
        email: 'test@test.com',
      });
    expect(response.status).toBe(200);

    const secondResponse = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'small',
        email: 'test2@test.com',
      });
    expect(secondResponse.status).toBeGreaterThanOrEqual(400);
  });

  it('should not create if email already exists', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'small',
        email: 'test@test.com',
      });
    expect(response.status).toBe(200);

    const secondResponse = await request.post('/user/register')
      .send({
        username: 'test2',
        password: 'small',
        email: 'test@test.com',
      });
    expect(secondResponse.status).toBeGreaterThanOrEqual(400);
  });
});
