import generateTextCompletion from "./_generateTextCompletion";
import getMusicInformation from "./_getMusicInformation";

export default async function getTracksFromDescription(description) {

  const textCompletion = await generateTextCompletion(description);
  const songStrings = textCompletion.split('\n');
  var tracks = [];

  await Promise.all(songStrings.map(async (trackStr) => {
    try {
      const trackInformation = await getMusicInformation(trackStr);
      tracks.push(trackInformation);
    } catch (error) {
      console.error(`Error when retrieving music information for \'${trackStr}\': ${error.message}`);
    }
  }));

  return tracks;
}
