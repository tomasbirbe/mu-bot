import axios from 'axios';
import { load } from 'cheerio';
import pretty from '@starptech/prettyhtml';

interface Character {
  name: string;
  level: number;
}

export function getCharacterData(characterName: string): Promise<Character> {
  const characterNameNormalized = characterName.trim().toLocaleLowerCase();

  console.log('Just enter in getCharacterData');

  return new Promise((resolve, reject) => {
    console.log('Promise created');
    axios
      .get(`https://mu.cafe/profile/player/req/${characterNameNormalized}`)
      .then(({ data: characterPage }) => {
        console.log('axios get the page');
        const $ = load(characterPage);
        const characterNameFromPage = $('.cname ').text();

        console.log('personaje', characterNameFromPage);
        console.log('Cheerio load the page', characterNameFromPage);
        if (characterNameFromPage.trim().toLocaleLowerCase() === characterNameNormalized) {
          const characterDataRows = $(
            '.profiles_player_table.profiles_player_table_info > tbody > tr',
          );

          console.log('Get character data table');

          const levelRow = $(characterDataRows.get(0));
          const level = Number($(levelRow.children().get(1)).text());

          console.log('Get level row and level');
          console.log('level', level);

          if (level) {
            const characterData = {
              name: characterNameFromPage,
              level,
            };

            console.log('Resolve the promise');
            resolve(characterData);
          } else {
            console.log('Reject the promise for invalid level');
            reject({ msg: 'Problema al encontrar intentar scrapear el nivel' });
          }
        } else {
          console.log('Reject the promise for an invalid name');
          reject({ msg: `El personaje ${characterName} no existe` });
        }
      });
  });
}
