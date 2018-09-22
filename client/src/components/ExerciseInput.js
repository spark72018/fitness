import React, { Component } from 'react';

const LETTERS_ALLOWED_IN_NUMBER_INPUT = ['E', 'e'];

export default class ExerciseInput extends Component {
  state = {
    exerciseName: '',
    weight: 0,
    reps: 0,
    sets: 0
  };

  componentDidMount() {
    console.log('ExerciseInput props', this.props);
    if (this.props.exerciseName) {
      const { exerciseName, reps, sets } = this.props;
      return this.setState({
        exerciseName,
        reps,
        sets
      });
    }
  }

  handleWeightChange = e => {
    const { value } = e.target;
    const inpVal = parseInt(value, 10);

    if (!isNaN(inpVal) || value === '') {
      return this.setState({ weight: value });
    }
  };

  handleExerciseNameChange = e =>
    this.setState({ exerciseName: e.target.value });

  handleRepsChange = e => {
    const { value } = e.target;
    const inpVal = parseInt(value, 10);

    if (!isNaN(inpVal) || value === '') {
      return this.setState({ reps: value });
    }
  };

  handleSetsChange = e => {
    const { value } = e.target;
    const inpVal = parseInt(value, 10);

    if (!isNaN(inpVal) || value === '') {
      return this.setState({ sets: value });
    }
  };

  render() {
    const { exerciseName, weight, reps, sets } = this.state;
    return (
      <div className="row">
        <div className="input-field col s5">
          <input
            onChange={this.handleExerciseNameChange}
            placeholder="Exercise name"
            type="text"
            className="validate"
            value={exerciseName}
          />
        </div>
        <div className="input-field col s2">
          <input
            onChange={this.handleWeightChange}
            type="number"
            className="validate"
            id="weight-input"
            placeholder="Weight(lbs)"
            value={weight === 0 ? '' : weight}
          />
        </div>
        <div className="input-field col s2">
          <input
            onChange={this.handleRepsChange}
            id="reps-input"
            placeholder="Reps"
            type="number"
            className="validate"
            value={reps === 0 ? '' : reps}
          />
        </div>
        <div className="input-field col s2">
          <input
            onChange={this.handleSetsChange}
            placeholder="Sets"
            type="number"
            className="validate"
            id="sets-input"
            value={sets === 0 ? '' : sets}
          />
        </div>
        <a
          className={`${
            this.props.editMode
              ? 'scale-transition'
              : 'scale-transition scale-out'
          } btn-floating btn-medium waves-effect waves-light blue`}
        >
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
