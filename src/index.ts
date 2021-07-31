/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';
import router from './routes/main';
import { User } from './entities/User';
import GameCategory from './entities/GameCategory';
import Region from './entities/Region';
import Style from './entities/Style';
import Game from './entities/Game';

const app = express();

const corsConfig = {
  origin: [process.env.FRONTEND_URL, process.env.LANDING_URL, 'http://localhost:4000'],
  credentials: true, // this is for allowing cookies
};

app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(router);

dotenv.config();

(async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Game, GameCategory, Region, Style],
      synchronize: true, // DO NOT USE FOR PRODUCTION! USE MIGRATIONS INSTEAD
      ssl: true,
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is up and listening on port ${process.env.PORT}.`);
    });
  } catch (err) {
    console.log(err);
  }
})();

export default app;
