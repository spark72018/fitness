import React from 'react';

function makeRepsSetsInputs(reps, sets, acc) {
  const resultArr = [];
  for (let i = 0; i < sets; i++) {
    const setNumber = i + 1;
    resultArr.push(
      <div key={`workoutExerciseInput${i}`} className="input-field">
        <p>{`Set ${setNumber}`}</p>
        <input placeholder="reps" type="number" />
      </div>
    );
  }
  const result = <div className="sets-flex-container">{resultArr}</div>;
  return result;
}

export default function WorkoutExercise({ info }) {
  const { exerciseName, weight, reps, sets } = info;

  return (
    <div className="workout-exercise row z-depth-3">
      <p>{exerciseName}</p>
      <p>{`Weight: ${weight} lbs`}</p>
      <p>{`${reps} reps per set`}</p>
      {makeRepsSetsInputs(reps, sets)}
    </div>
  );
}
