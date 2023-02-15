import isItTheSameSong from "./_isItTheSameSong";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_API_CLIENT_SECRET
});

export default async function getMusicInformation(trackTitle, artist) {
  if (trackTitle == "")
    throw new Error('Blank tracktitle');
  if (artist == "")
    throw new Error('Blank artist');

  await spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      // Set the access token on the API object so that it's used in all future requests
      spotifyApi.setAccessToken(data.body['access_token']);
    });

  const resultBody = {
    trackTitle: "",
    artist: "",
    albumCover: "",
    audioPreviewUrl: "",
    isMatch: false
  };

  await spotifyApi.searchTracks(trackTitle + " " + artist)
    .then(async function (data) {
      const resultCount = data.body.tracks.items.length;
      if (resultCount == 0) {
        throw new Error('No results');
      }
      const bestResult = data.body.tracks.items[0];

      resultBody.trackTitle = bestResult.name;
      resultBody.artist = bestResult.artists.map(a => a.name).join(", ");
      resultBody.albumCover = bestResult.album.images[0].url;
      resultBody.audioPreviewUrl = bestResult.preview_url;
      resultBody.isMatch = await isItTheSameSong(trackTitle, artist, resultBody.trackTitle, resultBody.artist);
      
    }, function (error) {
      throw error;
    });

  console.debug(`MUSIC INFORMATION FOR \"${artist} | ${trackTitle}\"`);
  console.dir(resultBody);
  return resultBody;
}
