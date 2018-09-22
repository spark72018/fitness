const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  workoutName: String,
  exercises: [
    {
      exerciseName: String,
      weight: Number,
      reps: Number,
      sets: Number,
      datesCompleted: [Date]
    }
  ]
});

mongoose.model('workouts', workoutSchema);
