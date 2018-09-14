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
        console.log('promise info is', info);
        // console.log('info.body.items is', info.body.items);

        const { items } = info.body;
        const playlists = items.map(getPlaylistInfo);

        console.log('playlists', playlists);
        res.send({ playlists });
      })
      .catch(e => {
        console.log('promise e is', e);
        const { profileID } = req.user;
        const res = spotifyApi.refreshAccessToken();
        res
          .then(res => {
            const { accessToken } = res.body;
            spotifyApi.setAccessToken(accessToken);

            const updatedUser = User.findOneAndUpdate(
              { profileID },
              { $set: { accessToken } }
            );
            console.log('updatedUser is', updatedUser);

            res.send({ error: 'Could not refresh token!' });
          })
          .catch(e => {
            console.log('refreshAccessToken error', e);
          });
      });

    console.log('user_playlists error', e);

    //   res.status(400).send(e);
  });
};
