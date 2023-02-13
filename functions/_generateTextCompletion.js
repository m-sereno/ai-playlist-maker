import { Configuration, OpenAIApi } from "openai";
import MissingAPIKeyError from "../utils/errors/MisingAPIKeyError";
import InvalidDescriptionError from "../utils/errors/InvalidDescriptionError";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generateTextCompletion(description) {
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

  return completion.data.choices[0].text;
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