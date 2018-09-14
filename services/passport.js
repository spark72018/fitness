const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');
const {
  googleClientID,
  googleClientSecret,
  spotifyClientID,
  spotifyClientSecret
} = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ profileID: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({ profileID: profile.id }).save();
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: spotifyClientID,
      clientSecret: spotifyClientSecret,
      callbackURL: '/auth/spotify/callback',
      proxy: true
    },

    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        console.log('spotify profile info', profile);
        const existingUser = await User.findOne({ profileID: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          profileID: profile.id,
          accessToken,
          refreshToken
        }).save();
        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);
