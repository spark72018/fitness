const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  exerciseName: String,
  reps: Number,
  sets: Number
});

mongoose.model('exercises', exerciseSchema);
