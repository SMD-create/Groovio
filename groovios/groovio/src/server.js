const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const User = require('./models/User');
// Connect to MongoDB (make sure to replace 'your-mongodb-connection-string' with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is your Express.js server.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const User = require('./models/User');

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, dob, gender } = req.body;

    const user = new User({
      username,
      email,
      password, 
      dob,
      gender,
    });

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});
