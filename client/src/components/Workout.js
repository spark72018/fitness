import React, { Component } from 'react';
import WorkoutExercise from './WorkoutExercise';

export default class Workout extends Component {
  constructor(props) {
    super(props);
    const { currentRoutine } = this.props;
    this.state = {
      routineName: currentRoutine ? currentRoutine.routineName : ''
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    console.log('handleSubmit clicked');
    console.log('e.target', e.target.parentNode.childNodes);
    const childrenOfParent = [...e.target.parentNode.childNodes];
    // get all divs containing <input>, exclude submit button itself
    const exerciseContainers = childrenOfParent.filter(
      ({ nodeName }) => nodeName !== 'BUTTON'
    );
    const repsDoneInfo = exerciseContainers.map(parent => {
      const children = [...parent.childNodes];
      console.log('children', children);
      const [exerciseName, _weight, _repsPerSet, inputContainer] = children;
      console.log('exerciseName', exerciseName);
      console.log('inputContainer', inputContainer);
      const repsDone = [...inputContainer.childNodes].map(div => {
        const [_setText, inputEl] = [...div.childNodes];
        return inputEl.value;
      });
      console.log(repsDone);
      return { exerciseName, repsDone };
    });
    console.log('repsDoneInfo', repsDoneInfo);
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
              Submit
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
