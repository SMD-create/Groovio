// AudioPlayer.jsx

import './AudioPlayer.css'; // Import the CSS file

const AudioPlayer = () => {
  return (
    <audio controls id="audioPlayer">
      <source id="audioSource" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
