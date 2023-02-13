import Head from "next/head";
import { useState } from "react";
import { Box, Button, Container, createTheme, CssBaseline, TextField, ThemeProvider, Typography } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TrackView from "../components/TrackView";

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

export default function Home() {
  const [songsDescriptionInput, setSongsDescriptionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setResult(Array(5).fill(null));
    try {
      const response = await fetch("/api/getTracksFromDescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songsDescription: songsDescriptionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setSongsDescriptionInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
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
          {result == undefined ?
              "" : result.map((e, index) => <TrackView trackInfo={e} key={index} />)}
          </Box>
        </Box>
      </Container>

    </ThemeProvider>
  );
}
