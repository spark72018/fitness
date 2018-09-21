const mongoose = require('mongoose');
const { Schema } = mongoose;

const routineSchema = new Schema({
  routineName: String,
  exercises: [{
    exerciseName: String,
    weight: Number,
    reps: Number,
    sets: Number
  }],
  datesCompleted: [Date]
});

mongoose.model('routines', routineSchema);