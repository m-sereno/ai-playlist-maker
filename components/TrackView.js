import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AudioPlayer from "./AudioPlayer";

export default function TrackView({ trackInfo }) {
  const theme = useTheme();

  if (trackInfo.match) {
    return (
      <Box display="flex" flexDirection="row" alignItems="center" sx={{ m: 1 }}>
        <img src={trackInfo.albumCover} width={80} />
        <Box display="flex" flexDirection="column" sx={{ ml: 1 }}>
          <Typography variant="h6">{trackInfo.trackName}</Typography>
          <Typography variant="body2" color={theme.palette.grey[400]}>{trackInfo.artist}</Typography>
          <AudioPlayer key={trackInfo.audioPreviewUrl} url={trackInfo.audioPreviewUrl} />
        </Box>
      </Box>
    );
  }

  return (
    <Tooltip placement="right" title="This song couldn't be found on Spotify. Maybe it doesn't exist.">
      <Box width="max-content" display="flex" flexDirection="row" alignItems="center" sx={{ m: 1 }}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: 80, height: 80 }}>
          <QuestionMarkIcon fontSize="large" />
        </Box>
        <Box display="flex" flexDirection="column" sx={{ ml: 1 }}>
          <Typography variant="h6" color={theme.palette.error.main}>{trackInfo.fallbackSong}</Typography>
          <Typography variant="body2" color={theme.palette.error.dark}>{trackInfo.fallbackArtist}</Typography>
        </Box>
      </Box >
    </Tooltip>
  );
}