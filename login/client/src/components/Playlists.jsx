// Playlists.jsx
import PropTypes from 'prop-types';
import './Playlists.css';

const Playlists = ({ playlists, displayPlaylistSongs, setSelectedPlaylist, sharePlaylist, createPlaylist, setSelectedSong, addSongToPlaylist, songs }) => {
  return (
    <section id="playlist-section">
      <h2>Playlist Management</h2>

      <div className="playlist-cards">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card">
            <h3>{playlist.name}</h3>
            <button onClick={() => displayPlaylistSongs(playlist._id)}>Display Songs</button>
            <button onClick={() => setSelectedPlaylist(playlist._id)}>Select Playlist</button>
            <button onClick={sharePlaylist}>Share Playlist</button>
          </div>
        ))}
      </div>

      <button onClick={createPlaylist}>Create Playlist</button>

      <h3>Add Song to Playlist</h3>
      <label>Select Playlist:</label>
      <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
        <option value="">Select Playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist._id} value={playlist._id}>
            {playlist.name}
          </option>
        ))}
      </select>

      <label>Select Song:</label>
      <select onChange={(e) => setSelectedSong(e.target.value)}>
        <option value="">Select Song</option>
        {songs.map((song) => (
          <option key={song._id} value={song._id}>
            {song.title} by {song.artist}
          </option>
        ))}
      </select>
      <button onClick={addSongToPlaylist}>Add to Playlist</button>
    </section>
  );
};

Playlists.propTypes = {
  playlists: PropTypes.array.isRequired,
  displayPlaylistSongs: PropTypes.func.isRequired,
  setSelectedPlaylist: PropTypes.func.isRequired,
  sharePlaylist: PropTypes.func.isRequired,
  createPlaylist: PropTypes.func.isRequired,
  setSelectedSong: PropTypes.func.isRequired,
  addSongToPlaylist: PropTypes.func.isRequired,
  songs: PropTypes.array.isRequired,
};

export default Playlists;
