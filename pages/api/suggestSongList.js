import suggestSongList from "../../functions/_suggestSongList";

export default async function (req, res) {
  const songsDescription = req.body.songsDescription || '';

  try {
    const completion = await suggestSongList(songsDescription);
    res.status(200).json({ result: completion });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error when generating song list suggestion: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}