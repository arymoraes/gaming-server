const supertest = require('supertest');
import Game from '../../entities/Game';
import GameCategory from '../../entities/GameCategory';
import Region from '../../entities/Region';
import Style from '../../entities/Style';
import { User } from '../../entities/User';
import { createConnection } from 'typeorm';
import app from '../../index';
import dotenv from 'dotenv';

const request = supertest(app);
dotenv.config();

describe('It should work with /user endpoint', () => {
  
  beforeAll(async () => {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Game, GameCategory, Region, Style],
      synchronize: true, // DO NOT USE FOR PRODUCTION! USE MIGRATIONS INSTEAD
    });
  });

  it('responds with json', async () => {
    const response = await request.get('/')
    console.log(response.status);
    expect(response.status).toBe(200);
  });

  it('should create a new user', async () => {
    const response = await request.post('/user/register')
      .send({
        username: 'test',
        password: 'test',
        email: 'test@test.com',
      });
    console.log(response.status);
    expect(response.status).toBe(200);
  });
})