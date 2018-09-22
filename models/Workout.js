const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  routineId: String,
  workoutName: String,
  exercises: [
    {
      exerciseName: String,
      weight: Number,
      setsInfo: [Number]
    }
  ],
  dateCompleted: String
});

mongoose.model('workouts', workoutSchema);
