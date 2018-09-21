export default function(action) {
  return function(routineInfo) {
    return fetch(`/api/${action}_routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routineInfo)
    }).then(res => res.json()).catch(e => console.log(e));
  };
}
