const { spotifyClientID, spotifyClientSecret } = require('../config/keys');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClientID,
  clientSecret: spotifyClientSecret,
  redirectUri: '/auth/spotify/callback'
});
const getPlaylistInfo = require('../utilityFns/getPlaylistInfo');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = app => {
  app.get('/api/spotify/user_playlists', async (req, res) => {
    // console.log('/api/spotify/user_playlists');
    // console.log('req.user is', req.user);
    const { accessToken, refreshToken, profileID } = req.user;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    const userInfo = spotifyApi.getUserPlaylists(profileID, {
      limit: 50
    });
    userInfo
      .then(info => {
        const { items } = info.body;
        // getPlaylistInfo returns object { id, name, owner };
        const playlists = items.map(getPlaylistInfo);

        return res.send({ playlists });
      })
      .catch(e => {
        console.log('Attempting to refresh access token', e);
        const { profileID } = req.user;
        const differentAccessToken = spotifyApi.refreshAccessToken();
        differentAccessToken
          .then(async differentAccessTokenRes => {
            // console.log('differentAccessTokenRes is', differentAccessTokenRes);
            const { access_token } = differentAccessTokenRes.body;
            spotifyApi.setAccessToken(access_token);

            const updatedUser = User.findOneAndUpdate(
              { profileID },
              { $set: { accessToken } }
            );
            // console.log('updatedUser is', updatedUser);

            const secondAttempt = await spotifyApi.getUserPlaylists(profileID, {
              limit: 50
            });
            const { items } = secondAttempt.body;
            const playlists = items.map(getPlaylistInfo);

            return res.send({ playlists });
          })
          .catch(e => {
            console.log('refreshAccessToken error', e);
            return res.send({ error: 'Could not refresh token!' });
          });
      });
  });
};
