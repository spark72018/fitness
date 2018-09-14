import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header';
import Playlist from './components/Playlist';
import Button from './components/Button';
import './App.css';

class App extends Component {
  state = {
    auth: false,
    spotifyUser: false,
    playlists: [],
    currentPlaylist: null
  };

  async componentDidMount() {
    const res = await this.fetchUser();
    console.log('res is', res);
    if (res.notLoggedIn) {
      return this.setAuth(false);
    }
    if (res.spotifyUser) {
      this.setSpotifyUser(true);
    }
    this.setAuth(true);
  }

  handleSelectChange = e => {
    const [playlistID, user] = e.target.value.split(',');
    console.log('playlistID', playlistID);
    console.log('user', user);
    this.setCurrentPlaylist(playlistID, user);
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
    this.setState({ currentPlaylist: { playlistID, user } });

  setSpotifyUser = spotifyUser => this.setState({ spotifyUser });

  setPlaylists = playlists => this.setState({ playlists });

  setAuth = auth => this.setState({ auth });

  render() {
    const { auth, spotifyUser, playlists, currentPlaylist } = this.state;
    return (
      <BrowserRouter>
        <div className="container">
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/`}
            render={() => (
              <Header
                auth={auth}
                spotifyUser={spotifyUser}
                setPlaylists={this.setPlaylists}
              />
            )}
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
