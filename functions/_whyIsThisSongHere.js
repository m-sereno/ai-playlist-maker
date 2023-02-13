import { Configuration, OpenAIApi } from "openai";
import MissingAPIKeyError from "../utils/errors/MisingAPIKeyError";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function whyIsThisSongHere(playlistDescription, trackName, artist) {
  if (!configuration.apiKey) {
    throw new MissingAPIKeyError("OpenAI API key not configured, please follow instructions in README.md");
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(playlistDescription, trackName, artist),
    temperature: 0.6,
    max_tokens: 200
  });

  return completion.data.choices[0].text;
}

function generatePrompt(playlistDescription, trackName, artist) {
  return `Provide an explanation as to why a song is present in a given playlist.
Examples:

DESCRIPTION:
Heavy Metal songs about war.
SONG:
Black Sabbath | War Pigs
EXPLANATION:
Black Sabbath's “War Pigs,” was released in the early 70s, toward the end of the Vietnam war, a costly and bloody quagmire not unlike the Afghanistan War.
The song portrays generals and arms manufacturers as “war pigs” who kill in the name of their own greed.

DESCRIPTION:
Songs about colonization.
SONG:
Iron Maiden | Run To The Hills 
EXPLANATION:
The song's lyrics is about the European arrival to the "New World," told from the perspective of both the oppressed Cree and the invading Anglo-Saxon soldiers.
The first verse ("White man came across the sea, he brought us pain and misery") is from the point of view of the Natives.
The second verse ("Chasing the redskins back to their holes, fighting them at their own game") is from the white man's eyes.
The last verse ("Selling them whiskey and taking their gold, enslaving the young and destroying the old") is an impartial third-person narration.

DESCRIPTION:
Easy Piano Songs for Beginners to learn.
SONG:
Bach | Prelude in C Major
EXPLANATION:
Bach's Prelude in C Major is one of the best easy piano songs to learn when you want to start playing some classical music on the piano.
The tune is divided between the hands, but no two notes are played at the same time.
In other words, you only ever play one note at a time, even though you are using two hands.

DESCRIPTION:
${playlistDescription}
SONG:
${artist} | ${trackName}
EXPLANATION:
`;
}