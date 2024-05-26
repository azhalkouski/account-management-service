import express from 'express';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.get('/', (request, response) => {
  response.send('Welcome to the accounts management api!')
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
