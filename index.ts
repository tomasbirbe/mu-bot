import express, { json } from 'express';
import { config } from 'dotenv';
import axios from 'axios';

import { checkLvl } from './utils/character';

config();

interface Character {
  name: string;
  lvl: number;
  reset: number;
}
const { TOKEN, SERVER_URL } = process.env;

if (TOKEN && SERVER_URL) {
  const app = express();

  app.use(json());

  app.post('/', (req, res) => {
    const { message } = req.body;

    checkLvl(message.text.trim().toLocaleLowerCase())
      .then((character: Character) => {
        const text = `A ${message.text.trim()} le faltan ${400 - character['lvl']} para resetear`;

        axios({
          method: 'POST',
          url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
          data: {
            chat_id: message.chat.id,
            text,
          },
        })
          .then(() => res.send().status(200))
          .catch((e) => console.log(e));
      })
      .catch((e) =>
        axios({
          method: 'POST',
          url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
          data: {
            chat_id: message.chat.id,
            text: 'Ese personaje no se encuentra en el ranking',
          },
        }).then(() => res.send().status(404)),
      );

    //   if (character) {
    //     const text = `A ${message.text.trim()} le faltan ${400 - character['lvl']} para resetear`;

    //     axios({
    //       method: 'POST',
    //       url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
    //       data: {
    //         chat_id: message.chat.id,
    //         text,
    //       },
    //     })
    //       .then(() => res.send().status(200))
    //       .catch((e) => console.log(e));
    //   } else {
    //     axios({
    //       method: 'POST',
    //       url: `https://api.telegram.org/bot${TOKEN}/sendMessage`,
    //       data: {
    //         chat_id: message.chat.id,
    //         text: 'Ese personaje no se encuentra en el ranking',
    //       },
    //     })
    //       .then(() => res.send().status(404))
    //       .catch((e) => console.log(e));
    //   }
  });

  app.listen(3000, () => {
    console.log('App running on port 3000');
  });
}
