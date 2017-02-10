import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {cumulativeElevationChanges} from '../modules/cumulativeElevationChanges';
import {getDataFromNearestStation} from '../modules/NOAA';

function getTrail(id) {
  return (dispatch, getState) => {
    let cachedTrail = getState().trails.find(trail => trail.id == id);
    if (cachedTrail) return Promise.resolve(cachedTrail);

    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(t => {
        let trail = Object.assign({}, t)
        return dispatch({type: 'ADD_TRAIL', trail});
      });
  };
};

function getAltitudeData(trail) {
  return dispatch => {
    if (trail.hasElevationData) return Promise.resolve();
    return fetch(`/api/elevation/${trail.id}`)
      .then(response => response.json())
      .then(altitudeData => {
        let elevationChanges = cumulativeElevationChanges(altitudeData);
        return dispatch({type: 'SET_ELEVATION_DATA', elevationChanges, id: trail.id});
      });
  };
};

function getWeatherData(trail) {
  return dispatch => {
    if (trail.hasWeatherData) return Promise.resolve();
    getDataFromNearestStation({
      x: trail.center[1],
      y: trail.center[0],
      dataSetID: "NORMAL_DLY",
      dataTypeIDs: [
        "DLY-TMAX-NORMAL",
        "DLY-TMIN-NORMAL",
        "DLY-PRCP-PCTALL-GE001HI",
        "DLY-PRCP-PCTALL-GE050HI",
        "DLY-SNOW-PCTALL-GE001TI",
        "DLY-SNOW-PCTALL-GE030TI",
        "DLY-SNWD-PCTALL-GE001WI",
        "DLY-SNWD-PCTALL-GE010WI"
      ]
    }).then(weatherData => {
      return dispatch({type: 'SET_WEATHER_DATA', weatherData, id: trail.id});
    });
  }
}


export function previewTrail(id) {
  return dispatch => {
    dispatch(getTrail(id)).then( trail => {
      return dispatch({type: 'TOGGLE_PREVIEWING', trail});
    });
  };
};

export function selectTrail(id) {
  return dispatch => {
    dispatch(getTrail(id)).then(trail => {
      dispatch({type: 'TOGGLE_SELECTED', trail});
      dispatch(getAltitudeData(trail));
      dispatch(getWeatherData(trail));
    });
  };
};
