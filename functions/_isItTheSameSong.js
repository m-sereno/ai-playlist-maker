import { Configuration, OpenAIApi } from "openai";
import MissingAPIKeyError from "../utils/errors/MisingAPIKeyError";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function isItTheSameSong(songTitlePre, songArtistPre, songTitleFound, songArtistFound) {
  if (!configuration.apiKey) {
    throw new MissingAPIKeyError("OpenAI API key not configured, please follow instructions in README.md");
  }

  const songStringPre = `${songArtistPre} | ${songTitlePre}`;
  const songStringResult = `${songArtistFound} | ${songTitleFound}`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(songStringPre, songStringResult),
    temperature: 0.6,
    max_tokens: 2
  });

  const doSongsMatch = completion.data.choices[0].text;
  return doSongsMatch.toLowerCase().replace(/[^a-z]/g, "") == "yes";
}

function generatePrompt(songStringPre, songStringResult) {
  return `Check if the 2 provided ways to display a song name refer to the same song. A version by another artist is considered acceptable.
Examples:

Song 1: Iron Maiden | The Trooper
Song 2: Iron Maiden | The Trooper - 2015 Remaster
Match: Yes

Song 1: Creedence Clearwater Revival | Fortunate Son
Song 2: Creedence Clearwater Revival | Fortunate Son - Live
Match: Yes

Song 1: Tom Waits | Underground
Song 2: Tom Waits | Hold On
Match: No

Song 1: Stevie Wonder | Higher Ground
Song 2: Red Hot Chilli Peppers | Higher Ground - Remastered 2003
Match: Yes

Song 1: Johnny Cash | Ghost Riders In The Sky
Song 2: Johnny Cash | (Ghost) Riders In The Sky
Match: Yes

Song 1: Elton John | Rocket Man
Song 2: Elton John | Rocket Man (I Think It's Gong To Be a Long, Long Time)
Match: Yes

Song 1: Rolling Stones | Satisfaction
Song 2: The Rolling Stones | (I Can't Get No) Satisfaction - Mono Version
Match: Yes

Song 1: bill haley | Rock Around The Clock
Song 2: Bill Haley & His Comets | Rock Around The Clock
Match: Yes

Song 1: acdc | tnt
Song 2: AC/DC | T.N.T.
Match: Yes

Song 1: John Williams | Duel of the Fates
Song 2: John Williams | Star Wars
Match: No

Song 1: Metallica | Whiskey In The Jar
Song 2: The Dubliners | Whiskey In The Jar
Match: Yes

Song 1: Bob Marley | Is This Love
Song 2: Bob Marley & The Wailers | Is This Love
Match: Yes

Song 1: Beethoven | Moonlight Sonata
Song 2: Ludwig van Beethoven | Sonata for Piano no. 14 in C-sharp minor, op. 27 no. 2 “Moonlight”: I. Adagio sostenuto
Match: Yes

Song 1: Yann Tiersen | Comptine dun autre ete
Song 2: Yann Tiersen | Comptine d'un autre été, l'après-midi
Match: Yes

Song 1: Ennio Morricone | The Mission Main Theme
Song 2: Ennio Morricone, Yo-Yo Ma, Roma Sinfonietta | The Mission: Gabriel's Oboe
Match: Yes

Song 1: Joe Hisaishi | One Summer's Day (Spirited Away)
Song 2: Joe Hisaishi | One Summer Day
Match: Yes

Song 1: ${songStringPre}
Song 2: ${songStringResult}
Match: `;
}
