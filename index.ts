import express, { json } from 'express';
import { config } from 'dotenv';
import axios from 'axios';

import { checkLvl } from './utils/character';

config();

const { TOKEN, SERVER_URL } = process.env;

if (TOKEN && SERVER_URL) {
  const app = express();

  app.use(json());

  app.post('/', async (req, res) => {
    const { message } = req.body;

    const character = await checkLvl(message.text.trim().toLocaleLowerCase());

    if (character) {
      const text = `A ${message.text.trim()} le faltan ${400 - character['lvl']} para resetear`;

      axios({
        method: 'POST',
        url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        data: {
          chat_id: message.chat.id,
          text,
        },
      }).then(() => res.send().status(200));
    } else {
      axios({
        method: 'POST',
        url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        data: {
          chat_id: message.chat.id,
          text: 'Ese personaje no se encuentra en el ranking',
        },
      }).then(() => res.send().status(404));
    }
  });

  app.get('/', (req, res) => {
    console.log('hola');
    res.send('<h1>Hola!</h1>');
  });

  app.listen(3000, () => {
    console.log('App running on port 3000');
  });
}
