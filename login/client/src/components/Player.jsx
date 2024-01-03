import { useEffect, useState } from 'react';
import './Player.css';
import './AudioPlayer.css';
import AudioPlayer from './AudioPlayer';

const Player = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [selectedSong, setSelectedSong] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songsResponse = await fetch('http://localhost:3001/getSongs');
        const songsData = await songsResponse.json();

        if (songsData.success) {
          setSongs(songsData.songs);
        } else {
          alert('Failed to fetch songs');
        }

        const playlistsResponse = await fetch('http://localhost:3001/getPlaylists');
        const playlistsData = await playlistsResponse.json();

        if (playlistsData.success) {
          setPlaylists(playlistsData.playlists);
        } else {
          alert('Failed to fetch playlists');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const [availableUsers, setAvailableUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/getUsers');
        const data = await response.json();

        if (data.success) {
          setAvailableUsers(data.users);
        } else {
          alert('Failed to fetch available users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, []);



  const sharePlaylist = async () => {
    const playlistId = selectedPlaylist;
    const sharedWithEmail = prompt('Select a user to share the playlist with:', availableUsers.join('\n'));

    if (sharedWithEmail) {
      try {
        const response = await fetch(`http://localhost:3001/sharePlaylist/${playlistId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail: sharedWithEmail }),
        });

        if (response.ok) {
          alert('Playlist shared successfully');
        } else {
          const data = await response.json();
          alert(`Failed to share playlist: ${data.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sharing the playlist');
      }
    }
  };

  const playSelectedSong = async (songId) => {
    try {
      const response = await fetch(`http://localhost:3001/playSong/${songId}`);
      const data = await response.blob();

      if (response.ok) {
        const audioPlayer = document.getElementById('audioPlayer');
        const audioSource = document.getElementById('audioSource');

        audioSource.src = URL.createObjectURL(data);
        audioPlayer.load();
        audioPlayer.play();
      } else {
        alert('Failed to play the selected song');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addSongToPlaylist = async () => {
    try {
      const playlistId = selectedPlaylist;
      const songIdToAdd = selectedSong;

      const response = await fetch(`http://localhost:3001/addSongToPlaylist/${playlistId}/${songIdToAdd}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Song added to playlist successfully');

        const updatedSongsResponse = await fetch('http://localhost:3001/getSongs');
        const updatedSongsData = await updatedSongsResponse.json();

        if (updatedSongsData.success) {
          setSongs(updatedSongsData.songs);
        } else {
          alert('Failed to fetch updated songs');
        }
      } else {
        alert('Failed to add song to playlist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createPlaylist = async () => {
    try {
      const playlistName = prompt('Enter playlist name:');
      const response = await fetch('http://localhost:3001/createPlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playlistName }),
      });

      if (response.ok) {
        alert('Playlist created successfully');
        const updatedPlaylistsResponse = await fetch('http://localhost:3001/getPlaylists');
        const updatedPlaylistsData = await updatedPlaylistsResponse.json();

        if (updatedPlaylistsData.success) {
          setPlaylists(updatedPlaylistsData.playlists);
        } else {
          alert('Failed to fetch playlists');
        }
      } else {
        alert('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayPlaylistSongs = async () => {
    try {
      const playlistId = selectedPlaylist;
      const response = await fetch(`http://localhost:3001/getPlaylistSongs/${playlistId}`);
      const data = await response.json();

      if (data.success) {
        setSongs(data.songs);
      } else {
        alert('Failed to fetch songs for the selected playlist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="centered-container">
    <section id='sec'>
      <div id="song-list">
        {songs.map((song) => (
          <div key={song._id} className="songcard" onClick={() => playSelectedSong(song._id)}>
            <h3>{`${song.title} by ${song.artist}`}</h3>
          </div>
        ))}
      </div>
    </section>
      

      <div className="centered-container">
      <section id="playlist-section">

        <div className="playlist-options">
          <button onClick={createPlaylist}>Create Playlist</button>
          <h3>Add Song to Playlist</h3>
          <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
            <option value="">Select Playlist</option>
            
            {playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <br/>
          <select onChange={(e) => setSelectedSong(e.target.value)}>
            <option value="">Select Song</option>
            {songs.map((song) => (
              <option key={song._id} value={song._id}>
                {song.title} by {song.artist}
              </option>
            ))}
          </select>
          <button onClick={addSongToPlaylist}>Add to Playlist</button>
        </div>
        
        
        

      </section>
      
      </div>
      <div className="playlist-dropdown">
          
          <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
            <option value="">Select Playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <button onClick={() => displayPlaylistSongs(selectedPlaylist)}>Display Songs</button>
          <button onClick={sharePlaylist}>Share Playlist</button>
        </div>
      <div><section id='audio-player'>
              <AudioPlayer />
            </section>
    </div>
    
    </div>
    
  );
};

export default Player;
