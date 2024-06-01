import express from 'express';
import passport from 'passport';
import checkAuthenticationMiddleware from './middlewares/checkAuthentication.middleware';
import dotenv from 'dotenv';
import routes from './routes';
import { whiteListUrls } from './constants';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(passport.initialize());

//TODO: windson for logging
// switch on/off debug mode via .env
app.use(checkAuthenticationMiddleware(whiteListUrls));
app.use("/api/v1", routes);

app.get('/auth/login', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Welcome to the accounts management api!');
});

app.get('/', (req, res) => {
  res.send('Welcome to white listed');
});

app.get('/protected', (req, res) => {
  console.log('req.user', req.user);
  res.send('Welcome to protected!');
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
