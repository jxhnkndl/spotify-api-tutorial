const express = require('express');
const generateString = require('./utils/generateString');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  res.send('Hello Spotify');
});

// request authorization to access data through spotify's api
app.get('/login', (req, res) => {

  // create key and value for spotify auth state cookie
  const stateKey = 'spotify_auth_state';
  const state = generateString(16);

  // create and send cookie with randomly generated spotify auth state
  res.cookie(stateKey, state);

  // specify auth scopes to allow access to data about currently logged
  // in user's account and email address
  const scope = 'user-read-private user-read-email';

  // query parameters for authorizing application with spotify
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  });
  
  // redirect request to spotify's authorization endpoint w/ query params
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
