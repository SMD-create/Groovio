// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// Define routes related to songs
router.post('/store', (req, res) => {
  // Example: Handle the song storage request
  const { title, artist, audioFilePath } = req.body;
  songController.storeSong(title, artist, audioFilePath);
  res.send('Song storage request received.');
});

module.exports = router;
