import { Configuration, OpenAIApi } from "openai";
import MissingAPIKeyError from "../utils/errors/MisingAPIKeyError";
import InvalidDescriptionError from "../utils/errors/InvalidDescriptionError";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function suggestSongList(description) {
  if (!configuration.apiKey) {
    throw new MissingAPIKeyError("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (description.trim().length === 0) {
    throw new InvalidDescriptionError("Please enter a valid description");
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(description),
    temperature: 0.6,
    max_tokens: 160
  });

  var rawText = completion.data.choices[0].text;
  var songList = textToList(rawText);

  console.log("\nSUGGESTIONS");
  console.table(songList);
  return songList;
}

function generatePrompt(songsDescription) {
  return `Suggest a list of 5 songs based on a description.
Examples:

Description:
Songs about War.
The main instrument is a guitar, and there are vocals.

Songs:
- Iron Maiden | The Trooper
- Black Sabbath | War Pigs
- U2 | Sunday Bloody Sunday
- Creedence Clearwater Revival | Fortunate Son
- Rage Against the Machine | Killing in the Name

Description:
Jazz songs where the main instrument is the sax.

Songs:
- Duke Ellington | Take the 'A'
- John Coltrane | Giant Steps
- Erroll Garner | Misty
- Sonny Rollins | St. Thomas
- Coleman Hawkins | Body and Soul

Description:
${songsDescription}

Songs:
`;
}

function textToList(rawText) {
  var songStrings = rawText.split('\n');

  var songList = songStrings.map((trackStr, index) => {
    if (trackStr.trim() == "") {
      return null;
    }
    var str = trackStr.slice(2);
    var [artist, trackTitle] = str.split('|').map(s => s.trim());
    return { trackTitle: trackTitle, artist: artist };
  });

  return songList.filter(x => x);
}