const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
const server = app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

mongoose.connect('mongodb://127.0.0.1:27017/Groovio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a Mongoose model for songs
const Song = mongoose.model('Song', {
  title: String,
  artist: String,
  audioData: Buffer, // Directly store the audio data as a Buffer
});

// Define a Mongoose model for playlists
const Playlist = mongoose.model('Playlist', {
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle song uploads
app.post('/storeSong', upload.single('audioFile'), (req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const audioData = req.file.buffer;

  Song.create({ title, artist, audioData })
    .then(song => {
      console.log(`Song ${song.title} by ${song.artist} stored successfully.`);
      res.status(200).send('Song stored successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Route to get the list of songs
app.get('/getSongs', async (req, res) => {
  try {
    const songs = await Song.find({}, 'title artist');
    res.json({ success: true, songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch songs' });
  }
});

// Route to play a song by ID
app.get('/playSong/:id', async (req, res) => {
  const songId = req.params.id;

  try {
    const song = await Song.findById(songId);

    if (!song) {
      res.status(404).json({ success: false, error: 'Song not found' });
      return;
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(song.audioData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//Route to Share a Playlist
app.post('/sharePlaylist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { userEmail } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Add the shared playlist to the user's document
    user.sharedPlaylists.push({ playlistId, sharedWithEmail: req.user.email });
    await user.save();

    res.json({ success: true, message: 'Playlist shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to create a playlist
app.post('/createPlaylist', async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, error: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({ name, songs: [] });
    console.log(`Playlist ${playlist.name} created successfully.`);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create playlist' });
  }
});

// Route to get the list of playlists
app.get('/getPlaylists', async (req, res) => {
  try {
    const playlists = await Playlist.find({}, 'name');
    res.json({ success: true, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch playlists' });
  }
});


// Route to disconnect the server
app.post('/disconnect', (req, res) => {
  server.close(() => {
    res.json({ success: true });
  });
});

// Route to play a song from a playlist by ID
app.get('/getPlaylistSong/:playlistId/:songId', async (req, res) => {
  const playlistId = req.params.playlistId;
  const songId = req.params.songId;

  try {
    const playlist = await Playlist.findById(playlistId).populate('songs', 'title artist audioData');

    if (!playlist) {
      res.status(404).json({ success: false, error: 'Playlist not found' });
      return;
    }

    const song = playlist.songs.find(s => s._id.toString() === songId);

    if (!song) {
      res.status(404).json({ success: false, error: 'Song not found in the playlist' });
      return;
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(song.audioData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Function to play the selected song from the playlist
async function playSelectedPlaylistSong() {
  try {
    const playlistId = document.getElementById('playlistSelect').value;
    const songId = document.getElementById('songName').value;

    const response = await fetch(`http://localhost:3001/getPlaylistSong/${playlistId}/${songId}`);
    const data = await response.blob();

    if (response.ok) {
      const audioPlayer = document.getElementById('audioPlayer');
      const audioSource = document.getElementById('audioSource');

      audioSource.src = URL.createObjectURL(data);
      audioPlayer.load();
      audioPlayer.play();
    } else {
      const data = await response.json();
      alert(`Failed to play the selected song: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while playing the selected song');
  }
}


// Function to display songs of the selected playlist
async function displayPlaylistSongs() {
  const playlistId = document.getElementById('playlistSelect').value;
  const response = await fetch(`http://localhost:3001/getPlaylistSongs/${playlistId}`);
  const data = await response.json();

  if (data.success) {
    const songSelect = document.getElementById('songName');
    
    // Clear existing options
    songSelect.innerHTML = "";

    // Populate the dropdown with song names
    data.songs.forEach(song => {
      const option = document.createElement('option');
      option.value = song._id;
      option.text = `${song.title} by ${song.artist}`;
      songSelect.add(option);
    });
  } else {
    alert('Failed to fetch songs for the selected playlist');
  }
}

// Route to get the songs of a playlist by ID
app.get('/getPlaylistSongs/:id', async (req, res) => {
  const playlistId = req.params.id;

  try {
    const playlist = await Playlist.findById(playlistId).populate('songs', 'title artist');

    if (!playlist) {
      res.status(404).json({ success: false, error: 'Playlist not found' });
      return;
    }

    res.json({ success: true, songs: playlist.songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to get the list of songs to add to a playlist
app.get('/getSongsToAddToPlaylist', async (req, res) => {
  try {
    const songsToAdd = await Song.find({}, 'title artist');
    res.json({ success: true, songsToAdd });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch songs to add to playlist' });
  }
});

// Route to add a song to a playlist
app.post('/addSongToPlaylist/:playlistId/:songId', async (req, res) => {
  const playlistId = req.params.playlistId;
  const songId = req.params.songId;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }
    
    // Check if the song is already in the playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, error: 'Song already exists in the playlist' });
    }

    // Add the song to the playlist
    playlist.songs.push(songId);
    await playlist.save();

    res.json({ success: true, message: 'Song added to playlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const userSchema = new mongoose.Schema({
  // ... other fields
  sharedPlaylists: [
    {
      playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
      sharedWithEmail: String,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = app;

