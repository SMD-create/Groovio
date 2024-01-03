const express = require("express");
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require("cors");
const  userModel=require('./models/user')


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Groovio");


//lOGIN
app.post("/login", (req, res) => {
  const {username, password} = req.body;
  userModel.findOne({username: username})
  .then(u => {
      if(u) {
         if(u.password === password) {
              res.json("Succes")
         } else{
              res.json("Incoorect password ")
         }
      } else {
          res.json("User doesn't exist! ")
      }
  })
})

//register(signup)
app.post('/register', (req, res) =>{
  userModel.create(req.body)
  .then(users => res.json(users))
  .catch(err => res.json(err))

} )

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const Song = mongoose.model('Song', {
  title: String,
  artist: String,
  audioData: Buffer,
});

const Playlist = mongoose.model('Playlist', {
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

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

app.get('/getSongs', async (req, res) => {
  try {
    const songs = await Song.find({}, 'title artist');
    res.json({ success: true, songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch songs' });
  }
});

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

app.get('/getUsers', async (req, res) => {
  try {
    const users = await userModel.find({}, 'email');
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

app.post('/sharePlaylist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const { userEmail } = req.body;

  try {
    // Step 1: Fetch Users
    const usersResponse = await fetch('http://localhost:3001/getUsers');
    const usersData = await usersResponse.json();

    // Log the usersData for debugging
    console.log('Users Data:', usersData);

    // Step 2: Check if User Exists
    const availableUsers = usersData.success ? usersData.users.map(user => user.email) : [];

    if (!availableUsers.includes(userEmail)) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    const user = await user.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.sharedPlaylists.push({ playlistId, sharedWithEmail: req.body.userEmail });
    await user.save();

    res.json({ success: true, message: 'Playlist shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/getPlaylists', async (req, res) => {
  try {
    const playlists = await Playlist.find({}, 'name');
    res.json({ success: true, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch playlists' });
  }
});

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

async function playSelectedPlaylistSong() {
  try {
    // Your existing function logic
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while playing the selected song');
  }
}

async function displayPlaylistSongs() {
  try {
    // Your existing function logic
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch songs for the selected playlist');
  }
}

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

app.get('/getSongsToAddToPlaylist', async (req, res) => {
  try {
    const songsToAdd = await Song.find({}, 'title artist');
    res.json({ success: true, songsToAdd });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch songs to add to playlist' });
  }
});



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

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, error: 'Song already exists in the playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json({ success: true, message: 'Song added to playlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = app;


// ... (The rest of your authentication routes)

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
