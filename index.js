const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { mongoURI, cookieKey } = require('./config/keys');
const app = express();

require('./models/User');

require('./services/passport');

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// auto-auth in test environment
if (process.env.NODE_ENV === 'test') {
  const {
    userDataWithRoutines,
    userDataWithNoRoutines
  } = require('./test_data/testUserData');
  app.use((req, res, next) => {
    const profileIdWithRoutines = userDataWithRoutines.profileID;
    const profileIdWithNoRoutines = userDataWithNoRoutines.profileID;
    req.user = {
      profileIdWithRoutines,
      profileIdWithNoRoutines
    };
    next();
  });
}

require('./routes/authRoutes')(app);
require('./routes/spotifyRoutes')(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  // catch-all for unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
