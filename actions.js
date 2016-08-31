import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {createAltitudeQueryString} from './mapzenInterface';
import {cumulativeElevationChanges} from './cumulativeElevationChanges';

export function getHoveredTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => {
        dispatch({type: 'ADD_HOVERED_TRAIL', trail});
        dispatch(getAltitudeData(trail.geography.coordinates));
      });
  }
}

export function addActiveTrail(id) {
  return dispatch => {
    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(trail => { dispatch({type: 'ADD_TRAIL', trail}); });
  }
}

export function getAltitudeData(coordinates) {
  return dispatch => {
    return fetch(createAltitudeQueryString(coordinates))
      .then(response => response.json())
      .then(altitudeData => {
        let elevationChanges = cumulativeElevationChanges(altitudeData.range_height.map((e) => e[1]));
        let distance = _.last(altitudeData.range_height)[0]
        dispatch({type: 'SET_TRAILS_ELEVATION_CHANGES', elevationChanges});
        dispatch({type: 'SET_TRAILS_LENGTH', distance});
      });
  }
}
