import getTracksFromDescription from "../../functions/_getTracksFromDescription";
import MisingAPIKeyError from "../../utils/errors/MisingAPIKeyError";
import InvalidDescriptionError from "../../utils/errors/InvalidDescriptionError";

export default async function (req, res) {
  const songsDescription = req.body.songsDescription || '';

  try {
    const trackInfos = await getTracksFromDescription(songsDescription);
    res.status(200).json({ result: trackInfos });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error when processing prompt: ${error.message}`);
      if (error instanceof MisingAPIKeyError || error instanceof InvalidDescriptionError) {
        res.status(500).json({
          error: {
            message: error.message,
          }
        });
      } else {
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
  }
}