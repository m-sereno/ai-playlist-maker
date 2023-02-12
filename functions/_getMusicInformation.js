import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_API_CLIENT_SECRET
});

export default async function getMusicInformation(songString) {
  if (songString.trim().length === 0) {
    throw new Error("Blank song name");
  }

  await spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      // Set the access token on the API object so that it's used in all future requests
      spotifyApi.setAccessToken(data.body['access_token']);
    });

  const resultBody = await spotifyApi.searchTracks(songString)
    .then(function (data) {
      const resultCount = data.body.tracks.items.length;
      if (resultCount == 0) {
        throw new Error('No results');
      }
      const bestResult = data.body.tracks.items[0];
      const resultBody = {
        trackName: bestResult.name,
        artist: bestResult.artists.map(a => a.name).join(", "),
        albumCover: bestResult.album.images[0].url,
        audioPreviewUrl: bestResult.preview_url
      };
      return resultBody;
    }, function (error) {
      throw error;
    });

  return resultBody;
}
