process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const testUserData = require('../test_data/testUserData');
require('../models/User');
require('../models/Routine');
const User = mongoose.model('users');
const Routine = mongoose.model('routines');

chai.use(chaiHttp);

function checkIfSuccess(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.an('object');
  expect(res).to.have.property('routines');
}

describe('GET fitness routines test', () => {
  const server = require('../index');
  const route = 'http://localhost:5000';
  const { userDataWithRoutines, userDataWithoutRoutines } = testUserData;
  const savedUsers = { userWithRoutines: null, userWithoutRoutines: null };

    before(async () => {
      savedUsers.userWithoutRoutines = await new User(
        userDataWithoutRoutines
      ).save();
      savedUsers.userWithRoutines = await new User(userDataWithRoutines).save();
    });

    after(async () => {
      await User.collection.drop();
    });

  describe('routines successfully queried from db', () => {
    it('should return successful response for user with routines', async () => {
      const res = await chai.request(route).get('/api/user_routines');

      //   checkIfSuccess(res);
      expect(res).to.have.status(200);
      expect(res).to.be.an('object');
      expect(res).to.have.property('routines');
      expect(res.routines.length).to.equal(2);
    });
  });

  it('should return successful response for user with no routines', async () => {
    const res = await chai.request(route).get('/api/user_routines');

    checkIfSuccess(res);

    const { routines } = res;
    expect(routines.length).to.equal(0);
  });

  describe('routines successfully modified from db', () => {
    const addRoutineRoute = '/api/add_routine';
    const removeRoutineRoute = '/api/remove_routine';
    const extraRoutine = new Routine({
      routineName: 'anotherRoutine',
      exercises: [{ exerciseName: 'LOLS', reps: 10, sets: 3 }],
      datesCompleted: []
    });
    const routineToBeDeleted = 'firstRoutine';
    it('should add a routine to user who already has routines', async () => {
      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');

      const resAfterChange = await chai
        .request(route)
        .post(addRoutineRoute)
        .send(extraRoutine);

      expect(resAfterChange).to.have.status(200);
      expect(resAfterChange.routines.length).to.equal(
        resBeforeChange.routines.length + 1
      );
    });

    it('should remove a routine from user who already has routines', async () => {
      const hasRoutine = name => obj => obj.routineName === name;
      const hasFirstRoutine = 'firstRoutine';
      const resBeforeChange = await chai
        .request(route)
        .get('/api/user_routines');
      const resAfterChange = await chai
        .request(route)
        .post(removeRoutineRoute)
        .send(routineToBeDeleted);
      const { profileID } = savedUsers.userWithRoutines;
      const userDbDataAfterChange = User.findOne({ profileID });

      expect(resAfterChange).to.have.status(200);
      expect(resBeforeChange.length).to.be.greaterThan(resAfterChange.length);
      expect(userDbDataAfterChange.routines.some(hasFirstRoutine)).to.be.false;
    });

    it('should remove exercise from a routine', async () => {
        // can change name, sets, or reps
    });
  });
});
