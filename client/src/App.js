import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header';
import Playlist from './components/Playlist';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Routine from './components/Routine';
import Workout from './components/Workout';
import postSaveWorkout from './utilityFns/postSaveWorkout';
import postRemoveRoutine from './utilityFns/postRemoveRoutine';
import fetchUser from './utilityFns/fetchUser';
import './App.css';
/* TODO
- add option to remove ROUTINES
*/

class App extends Component {
  state = {
    auth: false,
    routines: [],
    spotifyUser: false,
    playlists: [],
    currentPlaylist: null,
    currentRoutine: null,
    loadingPlaylists: true,
    failedRemove: false
  };

  async componentDidMount() {
    try {
      const res = await fetchUser();
      console.log('App componentDidMount res is', res);
      const { routines } = res;
      console.log('App.js componentDidMount routines', routines);
      if (res.notLoggedIn) {
        return this.setAuth(false);
      }
      if (res.spotifyUser) {
        this.setSpotifyUser(true);
      }
      this.setAuth(true);
      this.setRoutines(routines);
    } catch (e) {
      throw new Error(e);
    }
  }

  setFailedRemove = failedRemove => this.setState({ failedRemove });

  handleDashboardRemoveWorkoutClick = async e => {
    try {
      const routineId = e.target.dataset.routineid;
      const res = await postRemoveRoutine({ routineId });
      console.log('res is', res);
      const { routines } = res;
      if (!routines.find(({ _id }) => _id === routineId)) {
        return this.setRoutines(routines);
      } else {
        return this.setFailedRemove(true);
      }
    } catch (e) {
      console.log('handleDashboardRemoveWorkoutClick error', e);
    }
  };

  toggleLoadingPlaylists = () =>
    this.setState({ loadingPlaylists: !this.state.loadingPlaylists });

  handleSelectChange = e => {
    const [playlistID, user] = e.target.value.split(',');

    return this.setCurrentPlaylist(playlistID, user);
  };

  handleFinishWorkoutClick = async e => {
    console.log('handleFinishWorkoutClick called');
    // await postSaveWorkout();
  };

  setCurrentRoutine = currentRoutine =>
    this.setState({ currentRoutine }, () => console.log(this.state));

  handleDashboardClick = e => {
    const { routines } = this.state;
    const routineId = e.target.dataset.routineid;
    const chosenRoutine = routines.find(({ _id }) => _id === routineId);

    return this.setCurrentRoutine(chosenRoutine);
  };

  handleDashboardEditClick = e => {
    console.log(e.target.parentNode.previousSibling);
    const anchorWithId = e.target.parentNode.previousSibling;
    const routineId = anchorWithId.dataset.routineid;
    const { routines } = this.state;
    const chosenRoutine = routines.find(({ _id }) => _id === routineId);

    return this.setCurrentRoutine(chosenRoutine);
  };

  setCurrentPlaylist = (playlistID, user) =>
    playlistID === 'none'
      ? this.setState({ currentPlaylist: null })
      : this.setState({ currentPlaylist: { playlistID, user } });

  setRoutines = routines => this.setState({ routines });

  setSpotifyUser = spotifyUser => this.setState({ spotifyUser });

  setPlaylists = playlists => this.setState({ playlists });

  setAuth = auth => this.setState({ auth });

  render() {
    const {
      auth,
      routines,
      spotifyUser,
      playlists,
      currentPlaylist,
      currentRoutine,
      loadingPlaylists,
      failedRemove
    } = this.state;
    return (
      <BrowserRouter>
        <div className="container">
          <Header
            auth={auth}
            spotifyUser={spotifyUser}
            setPlaylists={this.setPlaylists}
            setFailedRemove={this.setFailedRemove}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/`}
            render={() => <Landing />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/dashboard`}
            render={() => (
              <Dashboard
                auth={auth}
                routines={routines}
                failedRemove={failedRemove}
                handleDashboardClick={this.handleDashboardClick}
                handleDashboardEditClick={this.handleDashboardEditClick}
                handleDashboardRemoveWorkoutClick={
                  this.handleDashboardRemoveWorkoutClick
                }
              />
            )}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/new_routine`}
            render={() => (
              <Routine auth={auth} setRoutines={this.setRoutines} />
            )}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/routine`}
            render={() => (
              <Routine
                auth={auth}
                setRoutines={this.setRoutines}
                currentRoutine={currentRoutine}
              />
            )}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/workout`}
            render={() => (
              <Workout
                currentRoutine={currentRoutine}
                handleFinishWorkoutClick={this.handleFinishWorkoutClick}
              />
            )}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/user_playlists`}
            render={() => (
              <Playlist
                auth={auth}
                loadingPlaylists={loadingPlaylists}
                playlists={playlists}
                currentPlaylist={currentPlaylist}
                setPlaylists={this.setPlaylists}
                toggleLoadingPlaylists={this.toggleLoadingPlaylists}
                handleSelectChange={this.handleSelectChange}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
