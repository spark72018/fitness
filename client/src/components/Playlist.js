import React, { Component } from 'react';
import SpotifyPlayButton from './SpotifyPlayButton';

export default class Playlist extends Component {
  async componentDidMount() {
    const { fetchUserPlaylists, setPlaylists } = this.props;
    const { playlists } = await fetchUserPlaylists();
    console.log('Playlist', playlists);
    return setPlaylists(playlists);
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
    return (
      <React.Fragment>
        <select onChange={handleSelectChange}>
          <option value="none">No playlist selected</option>
          {playlists.map(this.makeOptionTag)}
        </select>
        {currentPlaylist ? (
          <SpotifyPlayButton
            user={currentPlaylist.user}
            id={currentPlaylist.playlistID}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
