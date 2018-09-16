const mongoose = require('mongoose');
const { Schema } = mongoose;

const routineSchema = new Schema({
  routineName: String,
  exercises: [{
    exerciseName: String,
    reps: Number,
    sets: Number
  }],
  datesCompleted: [Date]
});

mongoose.model('routines', routineSchema);