import express from 'express';
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

app.get('/', (req, res) => {
  logger.info('index route requested');

  res.json({
    message: 'Welcome to white listed'
  });
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
