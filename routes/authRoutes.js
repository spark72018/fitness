const passport = require('passport');

module.exports = app => {
  app.get('/api/current_user', (req, res) => {
    // req.user ? res.json(req.user) : res.json({ notLoggedIn: true });
    if (req.user) {
      const { routines, _id, profileID } = req.user;
      return res.json({
        _id,
        profileID,
        routines,
        ...(req.user.accessToken
          ? { spotifyUser: true }
          : { spotifyUser: false })
      });
    }
    return res.json({ notLoggedIn: true });
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  // Google OAuth routes
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  //Spotify OAuth routes
  app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      scope: ['playlist-read-private']
    })
  );

  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify'),
    (req, res) => {
      res.redirect('/');
    }
  );
};
