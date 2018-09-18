import React, { Component } from 'react';

export default class ExerciseInput extends Component {
  state = {
    exerciseName: '',
    reps: 0,
    sets: 0
  };
  handleExerciseNameChange = e =>
    this.setState({ exerciseName: e.target.value });
  handleRepsChange = e => {
    const inpVal = parseInt(e.target.value, 10);

    if (!isNaN(inpVal)) {
      this.setState({ reps: e.target.value });
    }
  };
  handleSetsChange = e => {
    const inpVal = parseInt(e.target.value, 10);

    if (!isNaN(inpVal)) {
      this.setState({ sets: e.target.value });
    }
  };
  render() {
    const { exerciseName, reps, sets } = this.state;
    return (
      <div className="row">
        <div className="input-field col s6">
          <input
            onChange={this.handleExerciseNameChange}
            placeholder="Exercise name"
            type="text"
            className="validate"
            value={exerciseName}
          />
        </div>
        <div className="input-field col s1">
          <input
            onChange={this.handleRepsChange}
            placeholder="Reps"
            type="number"
            className="validate"
            value={reps}
          />
        </div>
        <div className="input-field col s1">
          <input
            onChange={this.handleSetsChange}
            placeholder="Sets"
            type="number"
            className="validate"
            value={sets}
          />
        </div>
        <a className="btn-floating btn-medium waves-effect waves-light red">
          <i
            data-key={this.props.dataKey}
            onClick={this.props.handleCloseClick}
            className="material-icons"
          >
            close
          </i>
        </a>
      </div>
    );
  }
}
