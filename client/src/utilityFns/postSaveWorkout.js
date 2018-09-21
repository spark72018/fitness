export default function postSaveWorkout(infoToSave) {
    return fetch('/api/save_workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoToSave)
      }).then(res => res.json()).catch(e => console.log(e));
}