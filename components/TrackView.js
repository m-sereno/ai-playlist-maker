import { Box, Skeleton, styled, Tooltip, tooltipClasses, Typography, useTheme } from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import InfoIcon from '@mui/icons-material/Info';
import AudioPlayer from "./AudioPlayer";

const TrackViewBox = (props) => (
  <Box width="max-content" height={100} display="flex" flexDirection="row" alignItems="center" sx={{ m: .5 }}>
    {props.children}
  </Box>
);

const TitleArtistPlayerBox = (props) => (
  <Box display="flex" flexDirection="column" sx={{ ml: 1 }}>
    {props.children}
  </Box>
);

const AlbumCover = (props) => (
  <Box marginY={1}>
    {props.src ? (
      <img src={props.src} width={80} height={80} />
    ) : null}
    {props.children}
  </Box>
);

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

export default function TrackView({ trackInfo }) {
  const theme = useTheme();

  if (trackInfo == null) {
    return (
      <TrackViewBox>
        <AlbumCover><Skeleton variant="rectangular" width={80} height={80} /></AlbumCover>
        <TitleArtistPlayerBox>
          <Typography variant="h6" width={210}><Skeleton /></Typography>
          <Typography variant="body2" width={100}><Skeleton /></Typography>
        </TitleArtistPlayerBox>
      </TrackViewBox>
    )
  }

  if (trackInfo.match) {
    return (
      <TrackViewBox width="max-content">
        <AlbumCover src={trackInfo.albumCover} />
        <TitleArtistPlayerBox>
          <Typography variant="h6">{trackInfo.trackName}</Typography>
          <Typography variant="body2" color={theme.palette.grey[400]}>{trackInfo.artist}</Typography>
          <AudioPlayer key={trackInfo.audioPreviewUrl} url={trackInfo.audioPreviewUrl} />
        </TitleArtistPlayerBox>
        <CustomWidthTooltip placement="right-start" sx={{ maxWidth: 800 }}
          title={<Typography variant="body2" whiteSpace="pre-line"  >{trackInfo.explanation}</Typography>}
        >
          <InfoIcon sx={{ mb: "auto", mt: 1, ml: 1 }} />
        </CustomWidthTooltip>
      </TrackViewBox>
    );
  }

  return (
    <CustomWidthTooltip placement="right" title={<Typography variant="body2" whiteSpace="pre-line">{`This song couldn't be found on Spotify.\nMaybe it doesn't exist.`}</Typography>}>
      <Box width="max-content" height={100} display="flex" flexDirection="row" alignItems="center" sx={{ m: .5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: 80, height: 80 }}>
          <QuestionMarkIcon fontSize="large" />
        </Box>
        <TitleArtistPlayerBox>
          <Typography variant="h6" color={theme.palette.error.main}>{trackInfo.fallbackSong}</Typography>
          <Typography variant="body2" color={theme.palette.error.dark}>{trackInfo.fallbackArtist}</Typography>
        </TitleArtistPlayerBox>
      </Box>
    </CustomWidthTooltip>
  );
}