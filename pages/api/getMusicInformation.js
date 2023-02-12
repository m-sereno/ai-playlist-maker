import getMusicInformation from "../../functions/_getMusicInformation";

export default async function (req, res) {
  const artistAndSong = req.body.songAndArtist || '';
  
  try {
    const musicInformation = await getMusicInformation(songsDescription);
    res.status(200).json({ result: musicInformation });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error when retrieving music information for \'${artistAndSong}\': ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
