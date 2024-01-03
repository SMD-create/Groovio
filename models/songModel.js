// models/songModel.js
const mongoose = require('mongoose');

const Song = mongoose.model('Song', {
  title: String,
  artist: String,
  audioData: Buffer,
});

module.exports = Song;
