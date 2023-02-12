import generateTextCompletion from "./_generateTextCompletion";
import getMusicInformation from "./_getMusicInformation";

export default async function getTracksFromDescription(description) {
  console.debug(`\nDescription:\n ${description}`);

  const textCompletion = await generateTextCompletion(description);
  console.debug(`Text Completion:\n ${textCompletion}`);

  const songStrings = textCompletion.split('\n');
  var tracks = Array(5).fill(null);

  await Promise.all(songStrings.map(async (trackStr, index) => {
    try {
      const trackInformation = await getMusicInformation(trackStr);
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
    }
  });
  console.debug('Track Information:');
  console.table(debugObj);
  return tracks;
}