const express = require('express');
const axios = require('axios');
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

// AUTH FLOW 1:
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
    scope: scope,
  });

  // redirect request to spotify's authorization endpoint w/ query params
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// AUTH FLOW 2:
// when auth code is issued, user gets redirected to this callback route
// where user must exchange the newly acquired auth code for an access token
app.get('/callback', async (req, res) => {
  // capture auth code from url query params
  const code = req.query.code || null;

  try {
    // request access token from spotify web api using auth code
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    });

    // if response was successful, request data about currently
    // logged in user
    if (response.status === 200) {

      // extract access token and token type from api response
      const { access_token, token_type } = response.data;

      try {
        // request data about currently logged in user from /me endpoint
        // include token type and token value in authorization headers
        const me = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });

        res.send(`<pre>${JSON.stringify(me.data, null, 2)}</pre>`);
      } catch (err) {
        res.send(err);
      }
    }
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
