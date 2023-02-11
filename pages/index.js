import Head from "next/head";
import { useState } from "react";
import { Box, Button, createTheme, CssBaseline, TextField, ThemeProvider, Typography } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

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
    try {
      const response = await fetch("/api/generate", {
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
        <link rel="icon" href="/playlist.png" />
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 15 }}>
        <PlaylistAddIcon color="primary" fontSize="large" />
        <Typography variant="h3">
          Describe the songs in the Playlist
        </Typography>
        <Box component="form" width={theme.spacing(80)} onSubmit={onSubmit} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5}}>
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
          <Button type="submit" variant="contained" value="Generate recommendations" sx={{my: 2}}>
            Submit
          </Button>
        </Box>
        <Typography whiteSpace="pre">{result}</Typography>
      </Box>

    </ThemeProvider>
  );
}
