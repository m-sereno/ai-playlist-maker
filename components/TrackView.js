import { Box, Typography, useTheme } from "@mui/material";
import AudioPlayer from "./AudioPlayer";

export default function TrackView({ trackInfo }) {
  const theme = useTheme();

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