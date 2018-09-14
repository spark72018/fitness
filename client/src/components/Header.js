import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  renderContent = () => {
    const { auth, spotifyUser } = this.props;
    return auth && spotifyUser ? (
      <React.Fragment>
        <li>
          <a href="/api/logout">Logout</a>
        </li>
        <li>
          <Link to={`${process.env.PUBLIC_URL}/user_playlists`}>PLAYLISTS</Link>
        </li>
      </React.Fragment>
    ) : auth ? (
      <li>
        <a href="/api/logout">Logout</a>
      </li>
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
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? '/routines' : '/'}
            className="left brand-logo"
          >
            Fitness App Logo
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}
