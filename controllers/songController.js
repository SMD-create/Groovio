// controllers/songController.js
const path = require('path');
const Song = require('../models/songModel');
const fs = require('fs').promises;

const storeSong = async (title, artist, audioFileName) => {
  try {
    const audioFilePath = path.join(__dirname, '..', audioFileName);
    const audioData = await fs.readFile(audioFilePath);
    const song = await Song.create({ title, artist, audioData });
    console.log(`Song ${song.title} by ${song.artist} stored successfully.`);
  } catch (err) {
    console.error(err);
  }
};

// Example usage with a specific song file name in the Groovio folder
storeSong('Song Title', 'Artist Name', 'Megham.mp3');

module.exports = { storeSong };
