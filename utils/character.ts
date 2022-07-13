import { load } from 'cheerio';
import axios from 'axios';

interface Character {
  name: string;
  lvl: number;
  reset: number;
}

export function checkLvl(name: string): Promise<Character> {
  const { SERVER_URL } = process.env;

  return new Promise((resolve, reject) => {
    return axios('https://mu.cafe/rankings/resets/').then(({ data: rankingPage }) => {
      const $ = load(rankingPage);

      const rankingTable = $('.rankings-table > tbody');
      const rankingRows = $(rankingTable).children('tr');

      let character: Character | null = null;

      console.log(rankingTable);
      rankingRows.each((idx, row) => {
        const characterDataElement = $(row).children('td');
        // Each td is an array like:
        // [position, img, classImg, name, activeIcon, lvl, reset, map]
        const characterData: Character = {
          name: $(characterDataElement.contents().get(3)).text().trim().toLocaleLowerCase(),
          lvl: Number($(characterDataElement.contents().get(5)).text()),
          reset: Number($(characterDataElement.contents().get(6)).text()),
        };

        console.log(characterData.name, name.trim().toLocaleLowerCase());

        if (characterData.name === name.trim().toLocaleLowerCase()) {
          character = characterData;

          return false;
        }
      });

      if (character) {
        resolve(character);
      } else {
        console.log(character);
        reject(null);
      }
    });
  });
}
