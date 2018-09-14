const mongoose = require("mongoose");
const { Schema } = mongoose;
const Routine = require('./Routine');

const routineSchema = new Schema({
    routineName: String,
    exercises: [{
        exerciseName: String,
        reps: Number,
        sets: Number
    }]
});

mongoose.model('routines', routineSchema);