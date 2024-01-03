// Songs.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Songs.css';

const Songs = ({ songs, playSelectedSong }) => {
  return (
    <div className="songs-list">
      <h2>Song List</h2>
      <ul>
        {songs.map((song) => (
          <li key={song._id} onClick={() => playSelectedSong(song._id)}>
            {`${song.title} by ${song.artist}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

Songs.propTypes = {
  songs: PropTypes.array.isRequired,
  playSelectedSong: PropTypes.func.isRequired,
};



/*return (
    <div>
      <section id="audio-player">
        <AudioPlayer />
        <h2>Song List</h2>
        <ul>
          {songs.map((song) => (
            <li key={song._id} onClick={() => playSelectedSong(song._id)}>
              {`${song.title} by ${song.artist}`}
            </li>
          ))}
        </ul>
      </section>
    </div>)*/
export default Songs;
