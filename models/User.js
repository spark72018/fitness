const mongoose = require('mongoose');
const { Schema } = mongoose;
const Routine = require('./Routine');

const userSchema = new Schema({
  profileID: String,
  accessToken: String,
  refreshToken: String,
  routines: [Routine]
});

mongoose.model('users', userSchema);
