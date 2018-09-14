import React from 'react';

export default function SpotifyPlayButton({user, id: playlistID}) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/user/${user}/playlist/${playlistID}`}
      width="300"
      height="380"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
}