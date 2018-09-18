import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header';
import Playlist from './components/Playlist';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Routine from './components/Routine';
import Button from './components/Button';
import './App.css';

class App extends Component {
  state = {
    auth: false,
    routines: [],
    spotifyUser: false,
    playlists: [],
    currentPlaylist: null
  };

  async componentDidMount() {
    try {
      const res = await this.fetchUser();
      // console.log('App componentDidMount res is', res);
      const { routines } = res;
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

  handleSelectChange = e => {
    const [playlistID, user] = e.target.value.split(',');

    return this.setCurrentPlaylist(playlistID, user);
  };

  fetchUser = () => {
    return fetch('/api/current_user')
      .then(res => res.json())
      .catch(e => console.log('caught fetchUser error', e));
  };

  fetchUserPlaylists = () => {
    return fetch('/api/spotify/user_playlists')
      .then(res => res.json())
      .catch(e => console.log('fetchUserPlaylists error', e));
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
      currentPlaylist
    } = this.state;
    return (
      <BrowserRouter>
        <div className="container">
          <Header
            auth={auth}
            spotifyUser={spotifyUser}
            setPlaylists={this.setPlaylists}
          />
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/`}
            render={() => <Landing />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/dashboard`}
            render={() => <Dashboard auth={auth} routines={routines} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/new_routine`}
            component={Routine}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/user_playlists`}
            render={() => (
              <Playlist
                playlists={playlists}
                currentPlaylist={currentPlaylist}
                setPlaylists={this.setPlaylists}
                fetchUserPlaylists={this.fetchUserPlaylists}
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
