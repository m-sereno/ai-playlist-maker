import { Box, Typography, useTheme } from "@mui/material";

export default function TrackView({ trackInfo }) {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" sx={{m: 2}}>
      <img src={trackInfo.albumCover} width={80} />
      <Box display="flex" flexDirection="column" sx={{m: 1}}>
        <Typography variant="h6">{trackInfo.trackName}</Typography>
        <Typography variant="body2" color={theme.palette.grey[400]}>{JSON.stringify(trackInfo.artist)}</Typography>
      </Box>
    </Box>
  );
}