const express = require('express');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  res.send('Hello Spotify');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
