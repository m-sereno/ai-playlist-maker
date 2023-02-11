import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const songsDescription = req.body.songsDescription || '';
  if (songsDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid description",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(songsDescription),
      temperature: 0.6,
      max_tokens: 160
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
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

Songs:`;
}
