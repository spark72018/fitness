import React, { Component } from 'react';
import SpotifyPlayButton from './SpotifyPlayButton';
import fetchSpotifyPlaylists from '../utilityFns/fetchSpotifyPlaylists';

export default class Playlist extends Component {
  async componentDidMount() {
    const { playlists } = await fetchSpotifyPlaylists();
    console.log('Playlist componentDidMount playlists', playlists);
    this.props.toggleLoadingPlaylists();
    return this.props.setPlaylists(playlists);
  }

  makeOptionTag({ id, name, owner }, idx) {
    return (
      <option key={`playlist${idx}`} value={`${id},${owner.id}`}>
        {name}
      </option>
    );
  }

  render() {
    const { playlists, handleSelectChange, currentPlaylist } = this.props;
    return this.props.loadingPlaylists ? (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    ) : (
      <React.Fragment>
        <div className="input-field z-depth-3">
          <select
            className="browser-default collapsible"
            onChange={handleSelectChange}
          >
            <option value="none">No playlist selected</option>
            {playlists.map(this.makeOptionTag)}
          </select>
        </div>
        {currentPlaylist ? (
          <div className="playlist-container">
            <SpotifyPlayButton
              user={currentPlaylist.user}
              id={currentPlaylist.playlistID}
            />
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}
