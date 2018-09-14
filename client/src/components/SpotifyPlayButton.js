import React from 'react';

export default function SpotifyPlayButton({user, id: playlistID}) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/user/${user}/playlist/${playlistID}`}
      width="300"
      height="380"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
}

/*

spotify:user:sparkspotify72018:playlist:1V0Ygg6FBHr0bmW0gdEJWg

spotify:user:spotify:playlist:37i9dQZF1DX4sWSpwq3LiO

spotify:user:toksogun:playlist:39BnLVziHWxVP7y7fafSvV

*/
