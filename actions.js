import fetch from 'isomorphic-fetch';

export function fetchTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => dispatch({type: 'SWAP_IN_TRAIL', trail}))
  }
}
