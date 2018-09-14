const mongoose = require('mongoose');
const { Schema } = mongoose;
const Exercise = require('./Exercise');

const routineSchema = new Schema({
  routineName: String,
  exercises: [Exercise]
});

mongoose.model('routines', routineSchema);
