import fetch from 'isomorphic-fetch';

export function setHoveredTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => { dispatch({type: 'ADD_HOVERED_TRAIL', trail}); })
  }
}

export function addActiveTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => { dispatch({type: 'ADD_TRAIL', trail}); })
  }
}
