import React, { Component } from 'react';
import ExerciseInput from './ExerciseInput';

// TODO: FIX ADDING AND REMOVING OF EXERCISEINPUTS

export default class Routine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routineNameInputVal: '',
      exercises: [],
      emptyExerciseInputs: [
        <ExerciseInput
          key="emptyExercise0"
          handleCloseClick={this.handleCloseClick}
        />
      ], // start off with one empty exercise input
      totalExercises: []
    };
  }
  // {exerciseName, reps, sets}

  componentDidMount() {
    return this.getAndSetCurrentTotalExercises();
  }

  getAndSetCurrentTotalExercises = () => {
    return this.setTotalExercises(this.getCurrentTotalExercises());
  };

  getCurrentTotalExercises = () => {
    const { exercises, emptyExerciseInputs } = this.state;
    const exercisesMade = exercises.map((info, idx) => (
      <ExerciseInput
        key={`exercise${idx}`}
        handleCloseClick={this.handleCloseClick}
        {...info}
      />
    ));
    const totalExercises = [...exercisesMade, ...emptyExerciseInputs];
    const totalExercisesWithDataAttr = totalExercises.map((exercise, idx) => (
      <ExerciseInput
        dataKey={`totalExercise${idx}`}
        key={`totalExercise${idx}`}
        {...exercise.props}
      />
    ));

    return totalExercisesWithDataAttr;
  };

  setTotalExercises = totalExercises => this.setState({ totalExercises });

  handleChange = e => this.setState({ routineNameInputVal: e.target.value });

  handleCloseClick = e => {
    const { totalExercises } = this.state;
    const clickedButtonKey = e.target.dataset.key;
    const filteredTotalExercises = totalExercises.filter(
      exercise => exercise.props.dataKey !== clickedButtonKey
    );

    return this.setTotalExercises(filteredTotalExercises);
  };

  incrementEmptyExerciseInputs = () => {
    const updatedTotalExercises = [
      ...this.state.totalExercises,
      <ExerciseInput
        key={`totalExercise${this.state.totalExercises.length}`}
        dataKey={`totalExercise${this.state.totalExercises.length}`}
        handleCloseClick={this.handleCloseClick}
      />
    ];
    return this.setTotalExercises(updatedTotalExercises);
  };

  getAll = (el, str) => el.querySelectorAll(str);

  handleSubmitButtonClick = e => {
    e.preventDefault();
    console.log('handleSubmitButtonClick', e.target.parentNode);
    const form = e.target.parentNode;
    const routineName = form.querySelector('#routine-name').value;
    const exerciseInputRows = this.getAll(form, '.row');
    console.log('exerciseInputRows', exerciseInputRows);
    // TODO
    // - iterate through each .row and get exerciseName, reps, sets
    // - make request to backend
    // - if successful, make sure page displays confirmation
    // - make routines AND exercises editable!
  };

  render() {
    const {
      routineNameInputVal,
      exercises,
      emptyExerciseInputs,
      totalExercises
    } = this.state;
    return (
      <div style={{ marginTop: '30px' }}>
        <a
          onClick={this.incrementEmptyExerciseInputs}
          className="btn-floating btn-medium waves-effect waves-light red"
        >
          <i className="large material-icons">add</i>
        </a>
        <form>
          <input
            onChange={this.handleChange}
            placeholder="Routine name"
            id="routine-name"
            type="text"
            className="validate"
            style={{ width: '80%' }}
            value={routineNameInputVal}
          />
          {totalExercises}
          <button
            onClick={this.handleSubmitButtonClick}
            className="btn waves-effect waves-light red"
            type="submit"
            name="action"
          >
            Submit
            <i className="material-icons right">send</i>
          </button>
        </form>
      </div>
    );
  }
}
