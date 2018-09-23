import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export default class Header extends Component {
  renderContent = () => {
    const {
      auth,
      spotifyUser,
      setFailedRemove,
      loadingOAuth,
      setLoadingOAuth
    } = this.props;
    return loadingOAuth ? (
      <LoadingSpinner />
    ) : auth && spotifyUser ? (
      <React.Fragment>
        <li>
          <Link
            onClick={() => setFailedRemove(false)}
            to={`${process.env.PUBLIC_URL}/dashboard`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link to={`${process.env.PUBLIC_URL}/user_playlists`}>
            My Spotify Playlists
          </Link>
        </li>
        <li>
          <a href="/api/logout">Logout</a>
        </li>
      </React.Fragment>
    ) : auth ? (
      <React.Fragment>
        <li>
          <Link
            onClick={() => setFailedRemove(false)}
            to={`${process.env.PUBLIC_URL}/dashboard`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <a href="/api/logout">Logout</a>
        </li>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <li>
          <a onClick={() => setLoadingOAuth(true)} href="/auth/google">
            Login With Google
          </a>
        </li>
        <li>
          <a onClick={() => setLoadingOAuth(true)} href="/auth/spotify">
            Login With Spotify
          </a>
        </li>
      </React.Fragment>
    );
  };
  render() {
    return (
      <nav>
        <div className="nav-wrapper blue">
          <Link
            style={{ fontFamily: 'Dancing Script, cursive' }}
            to="/"
            className="left brand-logo"
          >
            FitMuse
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}
