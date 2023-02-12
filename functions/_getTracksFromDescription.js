import generateTextCompletion from "./_generateTextCompletion";
import getMusicInformation from "./_getMusicInformation";

export default async function getTracksFromDescription(description) {
  console.debug(`\nDescription:\n ${description}`);

  const textCompletion = await generateTextCompletion(description);
  console.debug(`Text Completion: ${textCompletion}`);

  const songStrings = textCompletion.split('\n');
  var tracks = [];

  await Promise.all(songStrings.map(async (trackStr, index) => {
    try {
      if (index === 0 && trackStr == "") {
        return;
      }
      const trackInformation = await getMusicInformation(trackStr);
      tracks.push(trackInformation);
    } catch (error) {
      console.error(`Error when retrieving music information for \'${trackStr}\': ${error.message}`);
    }
  }));

  console.debug('Track Information:');
  console.table(tracks, ['trackName', 'artist']);
  return tracks;
}