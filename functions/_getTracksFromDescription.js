import generateTextCompletion from "./_generateTextCompletion";
import getMusicInformation from "./_getMusicInformation";
import isItTheSameSong from "./_isItTheSameSong";

export default async function getTracksFromDescription(description) {
  console.debug(`\nDescription:\n ${description}`);

  const textCompletion = await generateTextCompletion(description);
  console.debug(`Text Completion:\n ${textCompletion}`);

  const songStrings = textCompletion.split('\n');
  var tracks = Array(5).fill(null);

  await Promise.all(songStrings.map(async (trackStr, index) => {
    try {
      var trackInformation = await getMusicInformation(trackStr);
      const doSongsMatch = await isItTheSameSong(trackStr, trackInformation.trackName, trackInformation.artist);
      trackInformation.match = doSongsMatch.toLowerCase().replace(/[^a-z]/g, "") == "yes";

      tracks[index] = trackInformation;
    } catch (error) {
      console.error(`Error when retrieving music information for \'${trackStr}\': ${error.message}`);
    }
  }));

  const debugObj = songStrings.map((str, index) => {
    return {
      gptGiven: str,
      spotifyResultSong: tracks[index]?.trackName,
      spotifyResultArtist: tracks[index]?.artist,
      match: tracks[index]?.match
    }
  });
  console.debug('Track Information:');
  console.table(debugObj);
  return tracks;
}