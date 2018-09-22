const mongoose = require('mongoose');
const { Schema } = mongoose;

const Routines = require('./Routine');
const Workouts = require('./Workout');

const userSchema = new Schema({
  profileID: String,
  accessToken: String,
  refreshToken: String,
  routines: [Routines],
  workouts: [Workouts]
});

mongoose.model('users', userSchema);
