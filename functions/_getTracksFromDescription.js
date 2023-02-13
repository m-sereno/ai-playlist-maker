import suggestSongList from "./_suggestSongList";
import getMusicInformation from "./_getMusicInformation";
import isItTheSameSong from "./_isItTheSameSong";
import whyIsThisSongHere from "./_whyIsThisSongHere";

function splitArtistAndName(trackStr) {
  var str = trackStr.slice(2);

  var [artist, trackName] = str.split('|').map(s => s.trim());
  return { trackName: trackName, artist: artist };
}

export default async function getTracksFromDescription(description) {
  console.debug(`\nDescription:\n ${description}`);

  const songListSuggestion = await suggestSongList(description);
  console.debug(`Text Completion:\n ${songListSuggestion}`);

  const songStrings = songListSuggestion.split('\n');
  var tracks = Array(5).fill(null);

  await Promise.all(songStrings.map(async (trackStr, index) => {
    try {
      var fallbackData = splitArtistAndName(trackStr);
      var trackInformation = await getMusicInformation(trackStr);
      const doSongsMatch = await isItTheSameSong(trackStr, trackInformation.trackName, trackInformation.artist);
      trackInformation.match = doSongsMatch.toLowerCase().replace(/[^a-z]/g, "") == "yes";
      trackInformation.fallbackSong = fallbackData.trackName;
      trackInformation.fallbackArtist = fallbackData.artist;
      tracks[index] = trackInformation;
      if (doSongsMatch == false){
        return;
      }
      tracks[index].explanation = await whyIsThisSongHere(description, trackInformation.trackName, trackInformation.artist);
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