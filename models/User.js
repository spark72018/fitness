const mongoose = require('mongoose');
const { Schema } = mongoose;

const Routines = require('./Routine');

const userSchema = new Schema({
  profileID: String,
  accessToken: String,
  refreshToken: String,
  routines: [Routines]
});

mongoose.model('users', userSchema);
