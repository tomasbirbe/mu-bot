import { load } from 'cheerio';
import axios from 'axios';

interface Character {
  name: string;
  lvl: number;
  reset: number;
}

export async function checkLvl(name: string) {
  const url: string = 'https://mu.cafe/rankings/resets';
  const { data: rankingPage } = await axios(url);
  const $ = load(rankingPage);

  const rankingTable = $('.rankings-table > tbody');
  const rankingRows = $(rankingTable).children('tr');

  let character: Character | null = null;

  rankingRows.each((idx, row) => {
    const characterDataElement = $(row).children('td');
    // Each td is an array like:
    // [position, img, classImg, name, activeIcon, lvl, reset, map]
    const characterData: Character = {
      name: $(characterDataElement.contents().get(3)).text().trim().toLocaleLowerCase(),
      lvl: Number($(characterDataElement.contents().get(5)).text()),
      reset: Number($(characterDataElement.contents().get(6)).text()),
    };

    if (characterData.name === name.trim().toLocaleLowerCase()) {
      character = characterData;

      return false;
    }
  });

  if (character !== null) {
    return character;
  }
}
