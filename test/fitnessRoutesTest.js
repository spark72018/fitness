process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const testUserData = require('../test_data/testUserData');

require('../models/User');
require('../models/Routine');
const User = mongoose.model('users');

chai.use(chaiHttp);

function checkIfSuccess(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.an('object');
  expect(res).to.have.property('routines');
}

describe('fitness routines test', () => {
  const server = require('../index');
  const route = 'http://localhost:5000';
  const { userDataWithRoutines, userDataWithoutRoutines } = testUserData;
  const savedUsers = { userWithRoutines: null, userWithoutRoutines: null };

  before(async () => {
    const dbResponse = await Promise.all([
      new User(userDataWithoutRoutines).save(),
      new User(userDataWithRoutines).save()
    ]);
    savedUsers.userWithoutRoutines = dbResponse[0];
    savedUsers.userWithRoutines = dbResponse[1];
  });

  after(async () => {
    await User.collection.drop();
    // to avoid mongoose OverwriteModelError
    mongoose.models = {};
    mongoose.modelSchemas = {};
  });

  describe('routines successfully queried from db', () => {
    it('should return successful response for user with routines', async () => {
      const res = await chai.request(route).get('/api/user_routines');
      const data = res.body;

      expect(res).to.have.status(200);
      expect(data).to.have.property('routines');
      expect(data.routines.length).to.equal(2);
    });
  });

  describe('routines successfully modified from db', () => {
    const addRoutineRoute = '/api/add_routine';
    const extraRoutine = {
      routineName: 'anotherRoutine',
      exercises: [{ exerciseName: 'LOLS', reps: 10, sets: 3 }]
    };

    it('should add a routine to user who already has routines', async () => {
      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');

      const resAfterChange = await chai
        .request(route)
        .post(addRoutineRoute)
        .send(extraRoutine);

      expect(resAfterChange).to.have.status(200);
      expect(resAfterChange.body.routines.length).to.equal(
        resBeforeChange.body.routines.length + 1
      );
    });

    it('should remove a routine from user who already has routines', async () => {
      const hasRoutine = name => obj => obj.routineName === name;
      const hasFirstRoutine = hasRoutine('firstRoutine');
      const removeRoutineRoute = '/api/remove_routine';
      const routineToBeRemoved = 'firstRoutine';

      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');
      const resAfterChange = await chai
        .request(route)
        .post(removeRoutineRoute)
        .send({ routineToBeRemoved });

      const { profileID } = savedUsers.userWithRoutines;
      const userDbDataAfterChange = await User.findOne({ profileID });
      //   console.log('userDbDataAfterChange is', userDbDataAfterChange);

      expect(resAfterChange).to.have.status(200);
      expect(resBeforeChange.body.routines.length).to.be.greaterThan(
        resAfterChange.body.routines.length
      );
      expect(userDbDataAfterChange.routines.some(hasFirstRoutine)).to.be.false;
    });
  });

  const test = [
    { what: [{ name: 'one' }, { name: 'two' }] },
    { what: [{ name: 'three' }] }
  ];
  test.find(el => el.what.find(obj => obj.name === 'one'));
  test.find(el => el.what.find(obj => obj.name === 'four'));

  /* TODOS:
    - be able to change # of reps/sets of exercises within routines
  */

  describe('exercises successfully modified in db', () => {
    const routineToModify = 'secondRoutine';
    it('should add a new exercise to an existing routine', async () => {
      const addExerciseRoute = '/api/add_exercise';
      const toBeAdded = {
        exerciseName: 'Jumping Jacks',
        reps: 60,
        sets: 30
      };
      const data = { routineToModify, exercise: toBeAdded };
      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');
      const resAfterChange = await chai
        .request(route)
        .post(addExerciseRoute)
        .send(data);

      expect(
        resBeforeChange.body.routines
          .find(routine => routine.routineName === routineToModify)
          .exercises.find(
            exercise => exercise.exerciseName === toBeAdded.exerciseName
          )
      ).to.be.undefined;

      expect(resAfterChange).to.have.status(200);
      expect(
        resAfterChange.body.routines
          .find(routine => routine.routineName === routineToModify)
          .exercises.find(
            exercise => exercise.exerciseName === toBeAdded.exerciseName
          )
      ).to.not.be.undefined;
    });

    it('should remove a new exercise from a routine', async () => {
      const removeExerciseRoute = '/api/remove_exercise';
      const data = {
        routineName: 'secondRoutine',
        exerciseToRemove: 'Jumping Jacks'
      };
      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');
      const resAfterChange = await chai
        .request(route)
        .post(removeExerciseRoute)
        .send(data);

      expect(
        resBeforeChange.body.routines
          .find(routine => routine.routineName === routineToModify)
          .exercises.find(
            exercise => exercise.exerciseName === data.exerciseToRemove
          )
      ).to.not.be.undefined;

      expect(resAfterChange).to.have.status(200);
      expect(
        resAfterChange.body.routines
          .find(routine => routine.routineName === routineToModify)
          .exercises.find(
            exercise => exercise.exerciseName === data.exerciseToRemove
          )
      ).to.be.undefined;
    });
  });
});
