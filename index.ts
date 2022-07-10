import express from 'express';
import { config } from 'dotenv';

config();

const { TOKEN } = process.env;

if (TOKEN) {
  const app = express();

  app.listen(3000, () => {
    console.log('App running on port 3000');
  });
}
