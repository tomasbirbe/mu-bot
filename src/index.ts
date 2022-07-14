import express, { json } from 'express';
import { config } from 'dotenv';
import axios from 'axios';

import { getCharacterData } from '../utils/getCharacterData';

config();

interface Character {
  name: string;
  lvl: number;
  reset: number;
}
const { TOKEN, SERVER_URL, PORT } = process.env;

if (TOKEN && SERVER_URL) {
  const app = express();

  app.use(json());

  app.get('/', (req, res) => {
    res.send('<h1>Hola!</h1>');
  });

  app.post('/', (req, res) => {
    const { message } = req.body;

    console.log(message.text);

    getCharacterData(message.text)
      .then((character) => {
        res.send().status(200);
        axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          chat_id: message.chat.id,
          text: `A ${character.name} le faltan ${400 - character.level} niveles para resetear`,
        });
      })
      .catch((e) => {
        axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          chat_id: message.chat.id,
          text: e.msg,
        });
        res.send().status(404);
      });
  });

  app.listen(PORT || 3000, () => {
    console.log(`App running on port ${PORT}`);
  });
}
