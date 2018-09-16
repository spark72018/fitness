module.exports = {
  userDataWithNoRoutines: {
    profileID: 'hasNoRoutines',
    accessToken: '',
    refreshToken: '',
    routines: []
  },
  userDataWithRoutines: {
    profileID: 'hasRoutines',
    accessToken: '',
    refreshToken: '',
    routines: [
      {
        routineName: 'firstRoutine',
        exercises: [{ exerciseName: 'Squats', reps: 10, sets: 3 }],
        datesCompleted: []
      },
      {
        routineName: 'secondRoutine',
        exercises: [{ exerciseName: 'Push-ups', reps: 50, sets: 2 }],
        datesCompleted: []
      }
    ]
  }
};
