import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


//TODO: windson for logging
// switch on/off debug mode via .env

app.use("/api/v1", routes);

app.get('/', (request, response) => {
  response.send('Welcome to the accounts management api!')
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
