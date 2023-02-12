import React, { useState, useEffect } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { IconButton, useTheme } from "@mui/material";

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const AudioPlayer = ({ url }) => {
  const [playing, toggle] = useAudio(url);
  const theme = useTheme();

  return (
    <div>
      <IconButton onClick={toggle} color="primary">
        {playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
    </div>
  );
};

export default AudioPlayer;