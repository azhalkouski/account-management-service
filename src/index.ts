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

app.get('/auth/login', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Welcome to the accounts management api!');
});

app.get('/', (req, res) => {
  logger.info('index route requested');
  logger.debug(`request from origin (${req.headers.origin})`);

  res.json({
    message: 'Welcome to white listed'
  });
});

app.get('/protected', (req, res) => {
  console.log('req.user', req.user);
  res.send('Welcome to protected!');
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
