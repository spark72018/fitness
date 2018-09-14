const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();
const getPlaylistInfo = require('../utilityFns/getPlaylistInfo');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = app => {
  app.get('/api/spotify/user_playlists', async (req, res) => {
    console.log('/api/spotify/user_playlists');
    console.log('req.user is', req.user);
    const { accessToken, refreshToken, profileID } = req.user;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    const userInfo = spotifyApi.getUserPlaylists(profileID, {
      limit: 50
    });
    userInfo
      .then(info => {
        // console.log('promise info is', info);
        const { items } = info.body;
        const playlists = items.map(getPlaylistInfo);

        // console.log('playlists', playlists);
        return res.send({ playlists });
      })
      .catch(e => {
        console.log('Attempting to refresh access token', e);
        const { profileID } = req.user;
        const differentAccessToken = spotifyApi.refreshAccessToken();
        differentAccessToken
          .then(differentAccessTokenRes => {
            const { accessToken } = differentAccessTokenRes.body;
            spotifyApi.setAccessToken(accessToken);

            const updatedUser = User.findOneAndUpdate(
              { profileID },
              { $set: { accessToken } }
            );
            console.log('updatedUser is', updatedUser);

            return res.send({ error: 'Could not refresh token!' });
          })
          .catch(e => {
            console.log('refreshAccessToken error', e);
            return res.send(e);
          });
      });
  });
};
