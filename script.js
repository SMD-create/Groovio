const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');

const app = express();
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

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/indices.html');
});

// Route to handle song uploads
app.post('/storeSong', upload.single('audioFile'), (req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const audioData = req.file.buffer;

  Song.create({ title, artist, audioData }, (err, song) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(`Song ${song.title} by ${song.artist} stored successfully.`);
      res.status(200).send('Song stored successfully');
    }
  });
});

// Route to retrieve and play a song
app.get('/playSong/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      res.status(404).send('Song not found');
      return;
    }

    // Set the appropriate headers for audio playback
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': song.audioData.length,
    });

    // Send the audio data as the response
    res.send(song.audioData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});
