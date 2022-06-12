import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from 'config';
import routes from '../routes/routes';
import desearializeUser from '../middleware/desearializeUser';
function createServer() {
  const app: Application = express();

  // configure env variables
  dotenv.config();
  // Routes Imports

  // Middleware configuration
  app.use(helmet());
  app.use(
    cors({
      origin: config.get('origin'),
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('tiny'));
  app.use(express.static('public'));
  app.use(desearializeUser);
  // Routes Configuration
  app.get('/', (req: Request, res: Response) => {
    res.send('working');
  });
  // initialize routes
  routes(app);

  return app;
}

export default createServer;
