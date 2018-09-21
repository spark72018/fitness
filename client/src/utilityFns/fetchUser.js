export default function fetchUser() {
  return fetch('/api/current_user')
    .then(res => res.json())
    .catch(e => console.log('caught fetchUser error', e));
}
