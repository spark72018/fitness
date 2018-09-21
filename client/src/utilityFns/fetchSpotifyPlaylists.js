export default function fetchSpotifyPlaylists() {
  return fetch('/api/spotify/user_playlists')
    .then(res => res.json())
    .catch(e => console.log('fetchSpotifyPlaylists error', e));
}
