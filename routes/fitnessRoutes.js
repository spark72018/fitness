const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Routine = mongoose.model('routines');

module.exports = app => {
  app.get('/api/user_routines', requireLogin, async (req, res) => {
    // console.log('req.user is', req.user);
    try {
      const { profileID } = req.user;
      const userLookup = await User.findOne({ profileID });
      //   console.log('userLookup is', userLookup);
      return userLookup
        ? res.send(userLookup)
        : res.status(404).send({ error: 'Not found' });
    } catch (e) {
      console.log('/api/user_routines error', e);
      return res.send({ error: e });
    }
  });

  app.post('/api/add_routine', requireLogin, async (req, res) => {
    try {
      console.log('/api/add_routine');
      console.log('req.body is', req.body);
      const { profileID } = req.user;
      const { routineName, exercises } = req.body;

      const routineToBeAdded = new Routine({
        routineName,
        exercises,
        datesCompleted: []
      });
      const updatedUser = await User.findOneAndUpdate(
        { profileID },
        { $push: { routines: routineToBeAdded } },
        { new: true }
      );
      //   console.log('updatedUser is', updatedUser);
      const { routines } = updatedUser;
      return res.send({ profileID, routines });
    } catch (e) {
      res.send({ error: e });
    }
  });

  app.post('/api/remove_routine', requireLogin, async (req, res) => {
    try {
      // console.log('/api/remove_routine', req.body);
      const { routineId } = req.body;
      const { profileID } = req.user;
      const updatedUser = await User.findOneAndUpdate(
        { profileID },
        { $pull: { routines: { _id: mongoose.Types.ObjectId(routineId) } } },
        { new: true }
      );
      // console.log('updatedUser is', updatedUser);
      return res.send(updatedUser);
    } catch (e) {
      return res.send({ error: e });
    }
  });

  app.post('/api/modify_routine', requireLogin, async (req, res) => {
    try {
      // console.log('/api/modify_routine body', req.body);
      const { _id, routineName, exercises } = req.body;
      const { profileID } = req.user;

      const updatedUser = await User.findOneAndUpdate(
        { profileID, 'routines._id': mongoose.Types.ObjectId(_id) },
        {
          $set: {
            'routines.$.routineName': routineName,
            'routines.$.exercises': exercises
          }
        },
        { new: true }
      );

      // console.log('modify routine updatedUser', updatedUser);
      res.send({ profileID, routines: updatedUser.routines });
    } catch (e) {
      console.log('modify routine error', e);
      res.send({ error: e });
    }
  });

  app.post('/api/add_exercise', requireLogin, async (req, res) => {
    try {
      const { profileID } = req.user;
      const { routineToModify, exercise } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { profileID, 'routines.routineName': routineToModify },
        {
          $push: {
            'routines.$.exercises': exercise
          }
        },
        { new: true }
      );
      //   console.log('updatedUser is', updatedUser.routines);
      res.send(updatedUser);
    } catch (e) {
      console.log('/api/add_exercise error', e);
      return res.send({ error: e });
    }
  });

  app.post('/api/remove_exercise', requireLogin, async (req, res) => {
    try {
      const { profileID } = req.user;
      const { routineName, exerciseToRemove } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { profileID, 'routines.routineName': routineName },
        {
          $pull: {
            'routines.$.exercises': { exerciseName: exerciseToRemove }
          }
        },
        { new: true }
      );
      //   console.log('updatedUser', updatedUser.routines[0]);
      res.send(updatedUser);
    } catch (e) {
      console.log('/api/remove_exercise error', e);
      return res.send({ error: e });
    }
  });

  // TODO HANDLE SAVED WORKOUTS
  app.post('/api/save_workout', requireLogin, async (req, res) => {
    console.log('/api/save_workout req.body', req.body);
  });
};
