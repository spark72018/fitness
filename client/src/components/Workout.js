import React, { Component } from 'react';
import { withRouter } from 'react-router';
import WorkoutExercise from './WorkoutExercise';
import postSaveWorkout from '../utilityFns/postSaveWorkout';
import { MONTHS_ARRAY } from '../constants';

class Workout extends Component {
  constructor(props) {
    super(props);
    const { currentRoutine } = this.props;
    this.state = {
      routineId: currentRoutine ? currentRoutine._id : '',
      routineName: currentRoutine ? currentRoutine.routineName : ''
    };
  }

  makeDateString() {
    const date = new Date();
    const monthIndex = date.getMonth();
    const dateStr = `${
      MONTHS_ARRAY[monthIndex]
    } ${date.getDay()}, ${date.getFullYear()}`;

    return dateStr;
  }

  makeSetsInfoArr(exerciseContainers) {
    return exerciseContainers.map(parent => {
      const children = [...parent.childNodes];
      const [_exercise, _weight, _repsPerSet, inputContainer] = children;
      const exerciseName = _exercise.innerText;
      const weight = parseInt(_weight.dataset.weight);
      const setsInfo = [...inputContainer.childNodes].map(div => {
        const [_setsText, inputEl] = [...div.childNodes];
        const repsDone = parseInt(inputEl.value, 10);
        return isNaN(repsDone) ? 0 : repsDone;
      });

      return { exerciseName, weight, setsInfo };
    });
  }

  excludeButton(arr) {
    return arr.filter(({ nodeName }) => nodeName !== 'BUTTON');
  }

  handleSubmit = async e => {
    e.preventDefault();

    const childrenOfParent = [...e.target.parentNode.childNodes];
    // get all divs containing <input>, exclude submit button itself
    const exerciseContainers = this.excludeButton(childrenOfParent);
    const setsInfo = this.makeSetsInfoArr(exerciseContainers);
    const { routineId, routineName } = this.state;
    const res = await postSaveWorkout({
      routineId,
      routineName,
      setsInfo,
      dateCompleted: this.makeDateString()
    });

    this.props.setWorkoutSaved(true);
    this.props.history.push('/dashboard');
  };

  render() {
    const { currentRoutine } = this.props;
    if (currentRoutine) {
      const { routineName, exercises } = currentRoutine;
      return (
        <React.Fragment>
          <h3>{routineName}</h3>
          <div>
            {exercises.map((info, idx) => (
              <WorkoutExercise key={`workoutExercise${idx}`} info={info} />
            ))}
            <button
              onClick={this.handleSubmit}
              className="btn waves-effect waves-light blue"
              type="submit"
              name="action"
            >
              Save
              <i className="material-icons right">send</i>
            </button>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(Workout);
