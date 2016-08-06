import fetch from 'isomorphic-fetch';

export function swapTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => dispatch({type: 'SWAP_IN_TRAIL', trail}))
  }
}
