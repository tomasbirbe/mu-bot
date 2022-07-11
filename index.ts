import express from 'express';
import { config } from 'dotenv';

config();

const { TOKEN, SERVER_URL } = process.env;

if (TOKEN && SERVER_URL) {
  const app = express();

  app.post('/', (req, res) => {
    console.log(req);
  });

  app.get('/', (req, res) => {
    console.log('hola');
    res.send('<h1>Hola!</h1>');
  });

  app.listen(3000, () => {
    console.log('App running on port 3000');
  });
}
