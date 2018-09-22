import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  renderContent = () => {
    const { auth, spotifyUser, setFailedRemove } = this.props;
    return auth && spotifyUser ? (
      <React.Fragment>
        <li>
          <Link onClick={() => setFailedRemove(false)} to={`${process.env.PUBLIC_URL}/dashboard`}>Dashboard</Link>
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
          <Link onClick={() => setFailedRemove(false)} to={`${process.env.PUBLIC_URL}/dashboard`}>Dashboard</Link>
        </li>
        <li>
          <a href="/api/logout">Logout</a>
        </li>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <li>
          <a href="http://localhost:5000/auth/google">Login With Google</a>
        </li>
        <li>
          <a href="http://localhost:5000/auth/spotify">Login With Spotify</a>
        </li>
      </React.Fragment>
    );
  };
  render() {
    return (
      <nav>
        <div className="nav-wrapper blue">
          <Link style={{ 'fontFamily': 'Dancing Script, cursive' }} to="/" className="left brand-logo">
            FitMuse
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}
