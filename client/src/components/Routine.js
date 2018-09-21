import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ExerciseInput from './ExerciseInput';
import postAddRoutine from '../utilityFns/postAddRoutine';
import postModifyRoutine from '../utilityFns/postModifyRoutine';

export default class Routine extends Component {
  constructor(props) {
    super(props);
    const { currentRoutine } = this.props;
    this.state = {
      routineNameInputVal: currentRoutine ? currentRoutine.routineName : '',
      exercises: currentRoutine ? currentRoutine.exercises : [],
      emptyExerciseInputs: [
        <ExerciseInput
          key="emptyExercise0"
          editMode={true}
          handleCloseClick={this.handleCloseClick}
        />
      ], // start off with one empty exercise input
      totalExercises: [],
      fieldsError: false,
      routineJustMade: false,
      routineJustModified: false,
      editMode: currentRoutine ? false : true
    };
    console.log(
      'Routine constructor, currentRoutine is',
      this.props.currentRoutine
    );
  }

  componentDidMount() {
    if (this.props.currentRoutine) {
      const {
        currentRoutine: { exercises }
      } = this.props;
      this.setState({
        totalExercises: exercises.map(exerciseInfo => (
          <ExerciseInput {...exerciseInfo} />
        ))
      });
    }
    return this.getAndSetCurrentTotalExercises();
  }

  toggleEditMode = () => this.setState({ editMode: !this.state.editMode });

  getAndSetCurrentTotalExercises = () => {
    return this.setTotalExercises(this.getCurrentTotalExercises());
  };

  getCurrentTotalExercises = () => {
    const { exercises, emptyExerciseInputs, editMode } = this.state;
    const exercisesMade = exercises.map((info, idx) => (
      <ExerciseInput
        key={`exercise${idx}`}
        handleCloseClick={this.handleCloseClick}
        editMode={editMode}
        {...info}
      />
    ));
    const totalExercises = [...exercisesMade, ...emptyExerciseInputs];
    const totalExercisesWithDataAttr = totalExercises.map((exercise, idx) => (
      <ExerciseInput
        dataKey={`totalExercise${idx}`}
        key={`totalExercise${idx}`}
        editMode={editMode}
        {...exercise.props}
      />
    ));

    return totalExercisesWithDataAttr;
  };

  setEmptyExerciseInputs = arr => this.setState({ emptyExerciseInputs: arr });

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
    const { totalExercises, editMode } = this.state;
    const updatedTotalExercises = [
      ...this.state.totalExercises,
      <ExerciseInput
        key={`totalExercise${totalExercises.length}`}
        dataKey={`totalExercise${totalExercises.length}`}
        handleCloseClick={this.handleCloseClick}
        editMode={this.props.currentRoutine ? editMode : true}
      />
    ];
    return this.setTotalExercises(updatedTotalExercises);
  };

  getAll = (str, el) => el.querySelectorAll(str);

  getInputValues = exerciseRowDiv => {
    const rowElements = [...exerciseRowDiv.childNodes];
    // only want divs containing input tags
    // exclude button at end of each row
    const parentDivs = rowElements.slice(0, rowElements.length - 1);
    const inputValues = parentDivs.map(div => div.firstChild.value);
    return inputValues;
  };

  getExerciseInfo = exerciseRowDiv => {
    const inputValues = this.getInputValues(exerciseRowDiv);
    const [nameStr, weightStr, repsStr, setsStr] = inputValues;
    console.log(nameStr, typeof repsStr, typeof setsStr);
    const exerciseName = nameStr.trim();

    // make sure there is exerciseName
    // if there was previous error, remove it
    if (!exerciseName) {
      this.setState({ fieldsError: true });
      return null;
    } else if (this.state.fieldsError) {
      this.setState({ fieldsError: false });
    }

    const weight = parseInt(weightStr, 10);
    const reps = parseInt(repsStr, 10);
    const sets = parseInt(setsStr, 10);

    return { exerciseName, weight, reps, sets };
  };

  handleSubmitButtonClick = async (e, currentRoutine) => {
    e.preventDefault();
    const form = e.target.parentNode;
    const routineName = this.state.routineNameInputVal.trim();

    // make sure there is routineName
    // if there was previous error, remove it
    if (!routineName) {
      return this.setState({ fieldsError: true });
    } else if (this.state.fieldsError) {
      this.setState({ fieldsError: false });
    }

    const exerciseInputRows = [...this.getAll('.row', form)];
    const exercises = exerciseInputRows.map(this.getExerciseInfo);
    console.log('exercises', exercises);
    if (exercises.includes(null)) return;
    const routineInfo = { routineName, exercises };
    console.log('routineInfo', routineInfo);
    try {
      let res;
      if (currentRoutine) {
        const { _id } = currentRoutine;

        res = await postModifyRoutine({ ...routineInfo, _id });
        this.setState({ routineJustModified: true });
      } else {
        res = await postAddRoutine(routineInfo);
        this.setState({ routineJustMade: true });
      }
      return this.props.setRoutines(res.routines);
    } catch (e) {
      console.error(e);
    }
  };

  handleEditClick = async () => {
    await this.toggleEditMode();
    
    return this.getAndSetCurrentTotalExercises();
  };

  render() {
    const {
      routineNameInputVal,
      exercises,
      emptyExerciseInputs,
      totalExercises,
      fieldsError,
      routineJustMade,
      routineJustModified,
      editMode
    } = this.state;
    const { currentRoutine, auth } = this.props;
    return !auth ? (
      <h5>You must be logged in to create or modify routines!</h5>
    ) : routineJustMade ? (
      <h3>Routine successfully created!</h3>
    ) : routineJustModified ? (
      <h3>Routine successfully modified!</h3>
    ) : (
      <div style={{ marginTop: '30px' }}>
        <a
          onClick={this.incrementEmptyExerciseInputs}
          className={`${
            editMode ? 'scale-transition blue' : 'scale-transition scale-out'
          } btn-floating btn-medium waves-effect waves-light`}
        >
          <i className="large material-icons">add</i>
        </a>
        {currentRoutine ? (
          <a
            onClick={this.handleEditClick}
            className="btn-floating btn-medium waves-effect waves-light blue"
          >
            <i className="large material-icons">edit</i>
          </a>
        ) : null}
        {fieldsError ? (
          <h5 style={{ color: 'blue' }}>All name fields are required!</h5>
        ) : null}
        <form
          className={`${
            currentRoutine && !editMode ? 'no-click' : ''
          } z-depth-3`}
        >
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
          {currentRoutine && editMode ? (
            <button
              onClick={e => this.handleSubmitButtonClick(e, currentRoutine)}
              className="scale-transition btn waves-effect waves-light blue"
              type="submit"
              name="action"
            >
              Save Changes
              <i className="material-icons right">send</i>
            </button>
          ) : currentRoutine ? (
            <button
              onClick={e => this.handleSubmitButtonClick(e, currentRoutine)}
              className="scale-transition scale-out btn waves-effect waves-light blue"
              type="submit"
              name="action"
            >
              Save Changes
              <i className="material-icons right">send</i>
            </button>
          ) : (
            <button
              onClick={e => this.handleSubmitButtonClick(e, currentRoutine)}
              className="btn waves-effect waves-light blue"
              type="submit"
              name="action"
            >
              Submit
              <i className="material-icons right">send</i>
            </button>
          )}
        </form>
        {currentRoutine ? (
          <div className="fixed-action-btn">
            <Link
              to={`${process.env.PUBLIC_URL}/new_routine`}
              className="btn-floating btn-large waves-effect waves-light blue"
            >
              <i className="material-icons">add</i>
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}
