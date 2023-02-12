import getTracksFromDescription from "../../functions/_getTracksFromDescription";

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
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}