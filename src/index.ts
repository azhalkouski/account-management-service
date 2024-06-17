import express from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import passport from 'passport';
import cors from 'cors';
import checkAuthenticationMiddleware from './middlewares/checkAuthentication.middleware';
import dotenv from 'dotenv';
import routes from './routes';
import { whiteListUrls } from './constants';
import corsOptions from './configs/cors.config';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors(corsOptions));

app.use(checkAuthenticationMiddleware(whiteListUrls));
app.use("/api/v1", routes);

/**
 * Log error
 * Send response
 * 
 * From API security perspective, send 500 in all cases.
 * Don't help others discover api implementations by means of our
 * friendly error messages and status codes.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  res.sendStatus(500);
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
