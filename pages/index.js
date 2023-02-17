import Head from "next/head";
import { useReducer, useState } from "react";
import { Box, Button, Container, createTheme, CssBaseline, TextField, ThemeProvider, Typography } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TrackView from "../components/TrackView";
import {
  TRACK_STATUS_UNDEFINED,
  TRACK_STATUS_ERROR,
  TRACK_STATUS_LOADING_BASIC,
  TRACK_STATUS_LOADING_DETAIL,
  TRACK_STATUS_SUCCESS
} from "../components/TrackView";

const AVOIDRATELIMITING_COOLDOWN_MS = 1000;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
    },
    secondary: {
      main: '#7830BA',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
});

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

function defaultApiPost(bodyObject) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObject),
  }
}

const TI_ACTION_SETONETRACK = 0;
const TI_ACTION_SETONETRACKSTATUS = 1;
const TI_ACTION_SET = 2;
const TI_ACTION_SETONEFIELD = 3;

function trackInfosReducer(state, action) {
  switch (action.type) {

    case TI_ACTION_SETONETRACK:
      var targetIndex = action.targetIndex;
      var newValue = action.newValue;
      return state.map((value, index) =>
        index == targetIndex ? newValue : value
      );

    case TI_ACTION_SETONETRACKSTATUS:
      var targetIndex = action.targetIndex;
      var newStatus = action.newStatus;
      return state.map((value, index) =>
        index === targetIndex ? { ...value, status: newStatus } : value
      );

    case TI_ACTION_SET:
      var newState = action.newState;
      return newState;

    case TI_ACTION_SETONEFIELD:
      var targetIndex = action.targetIndex;
      var fieldName = action.field;
      var newFieldValue = action.value;
      return state.map((value, index) =>
        index === targetIndex ? { ...value, [fieldName]: newFieldValue } : value
      );

    default:
      throw new Error('Unknown action type');
  }
}

export default function Home() {
  const [songsDescriptionInput, setSongsDescriptionInput] = useState("");
  const [lastSentDescription, setLastSentDescription] = useState("");
  const [trackInfos, dispatchTrackInfos] = useReducer(trackInfosReducer, Array(5).fill({ status: TRACK_STATUS_UNDEFINED }));

  //#region DISPATCH WRAPPERS

  function setSpecificTrackInfo(index, newValue) {
    dispatchTrackInfos({
      type: TI_ACTION_SETONETRACK,
      targetIndex: index,
      newValue: newValue
    });
  }

  function setTrackStatus(index, statusCode) {
    dispatchTrackInfos({
      type: TI_ACTION_SETONETRACKSTATUS,
      targetIndex: index,
      newStatus: statusCode
    });
  }

  function setTrackInfos(newState) {
    dispatchTrackInfos({
      type: TI_ACTION_SET,
      newState: newState
    });
  }

  function setTrackField(index, field, value) {
    dispatchTrackInfos({
      type: TI_ACTION_SETONEFIELD,
      targetIndex: index,
      field: field,
      value: value
    });
  }

  //#endregion DISPATCH WRAPPERS

  async function retrievePlaylistSuggestion(description) {
    var suggestSongListBody = { songsDescription: description };
    var songListResponse = await fetch("/api/suggestSongList", defaultApiPost(suggestSongListBody));
    var songListResObj = await songListResponse.json();
    if (songListResponse.status !== 200) {
      throw songListResObj.error || new Error(`SuggestSongList Request failed with status ${songListResponse.status}`);
    }

    return songListResObj.result;
  }

  async function retrieveMusicInfo(songElement) {
    var trackTitle = songElement.trackTitle;
    var artist = songElement.artist;
    var getMusicInformationBody = { trackTitle: trackTitle, artist: artist };
    var musicInfoResponse = await fetch("/api/getMusicInformation", defaultApiPost(getMusicInformationBody));
    var musicInfoResObj = await musicInfoResponse.json();
    if (musicInfoResponse.status !== 200) {
      return null;
    }
    return musicInfoResObj.result;
  }

  async function retrieveExplanation(playlistDescription, trackTitle, artist) {
    var whyIsHereReqBody = { playlistDescription: playlistDescription, trackTitle: trackTitle, artist: artist };
    var whyHereResponse = await fetch("/api/whyIsThisSongHere", defaultApiPost(whyIsHereReqBody));
    var whyHereResObj = await whyHereResponse.json();
    if (whyHereResponse.status !== 200) {
      return null;
    }
    return whyHereResObj.result;
  }

  async function handleTooltipOpen(index) {
    if (trackInfos[index].explanation != undefined)
      return;

    setTrackField(index, "explanation", ""); // Signals it's being loaded

    var thisTrackTitle = trackInfos[index].trackTitle;
    var thisArtist = trackInfos[index].artist;
    var explanationString = await retrieveExplanation(lastSentDescription, thisTrackTitle, thisArtist);

    setTrackField(index, "explanation", explanationString); // Triggers component update
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLastSentDescription(songsDescriptionInput);
    setTrackInfos(Array(5).fill({ status: TRACK_STATUS_LOADING_BASIC }));

    try {
      var songList = await retrievePlaylistSuggestion(songsDescriptionInput);

      setTrackInfos(songList.map((se) => ({
        status: TRACK_STATUS_LOADING_DETAIL,
        trackTitle: se.trackTitle,
        artist: se.artist
      })));

      songList.forEach(async (songElement, index) => {
        await delay(AVOIDRATELIMITING_COOLDOWN_MS * index);
        var musicInfo = await retrieveMusicInfo(songElement);
        if (musicInfo == null) {
          setTrackStatus(index, TRACK_STATUS_ERROR);
          return;
        }

        setSpecificTrackInfo(index, {
          status: TRACK_STATUS_SUCCESS,
          trackTitle: musicInfo.trackTitle,
          artist: musicInfo.artist,
          albumCover: musicInfo.albumCover,
          audioPreviewUrl: musicInfo.audioPreviewUrl,
        });

      });

    } catch (error) {
      setTrackInfos(Array(5).fill({ status: TRACK_STATUS_UNDEFINED }));
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Head>
        <title>Playlist Maker</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
      </Head>

      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 8 }}>
          <PlaylistAddIcon color="primary" fontSize="large" />
          <Typography variant="h3">
            Describe the songs in the Playlist
          </Typography>
          <Box component="form" width={theme.spacing(80)} onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <TextField
              multiline minRows={4}
              type="text"
              name="songsDescription"
              label="Description"
              placeholder={"Songs about War.\nThe main instrument is a guitar, and there are vocals."}
              value={songsDescriptionInput}
              onChange={(e) => setSongsDescriptionInput(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" value="Generate recommendations" sx={{ my: 2 }}>
              Submit
            </Button>
          </Box>
          <Box minWidth={theme.spacing(100)}>
            {trackInfos.map((e, index) => <TrackView trackInfo={e} tooltipOpenCallback={() => handleTooltipOpen(index)} key={index} />)}
          </Box>
        </Box>
      </Container>

    </ThemeProvider>
  );
}
