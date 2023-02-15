import getMusicInformation from "../../functions/_getMusicInformation";

export default async function (req, res) {
  var trackTitle = req.body.trackTitle || '';
  var artist = req.body.artist || '';

  try {
    const musicInformation = await getMusicInformation(trackTitle, artist);
    if (musicInformation.isMatch)
      res.status(200).json({ result: musicInformation });
    else {
      res.status(500).json({ error: { message: 'No Spotify Match.' } });
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error when retrieving track information for \'${artist} | ${trackTitle}\': ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
