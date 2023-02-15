import whyIsThisSongHere from '../../functions/_whyIsThisSongHere';

export default async function (req, res) {
  const playlistDescription = req.body.playlistDescription || '';
  const trackTitle = req.body.trackTitle || '';
  const artist = req.body.artist || '';

  try {
    const explanation = await whyIsThisSongHere(playlistDescription, trackTitle, artist);
    res.status(200).json({ result: explanation });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error when generating explanation for \'${artist} | ${trackTitle}\': ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}