import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import routes from './routes';
import { getCookieMaxAge, getSessionSecret } from './utils';

dotenv.config();

const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = getCookieMaxAge();
const SESSION_SECRET = getSessionSecret();

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: COOKIE_MAX_AGE
    }
  })
);


//TODO: windson for logging
// switch on/off debug mode via .env

app.use("/api/v1", routes);

app.get('/', (request, response) => {
  response.send('Welcome to the accounts management api!')
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
