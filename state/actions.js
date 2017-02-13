import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {cumulativeElevationChanges} from '../modules/cumulativeElevationChanges';
import {getDataFromNearestStation} from '../modules/NOAA';

function getTrail(id) {
  return (dispatch, getState) => {
    let cachedTrail = getState().trails.find(trail => trail.id == id);

    if (cachedTrail) return Promise.resolve(cachedTrail);

    dispatch({type: 'ADD_TRAIL', id});

    return fetch(`/api/trails/${id}`)
      .then(response => response.json())
      .then(t => {
        let trail = Object.assign({}, t)
        dispatch({type: 'SET_BASE_DATA', trail});
        return trail;
      });
  };
};

function getAltitudeData(trail) {
  return (dispatch, getState) => {
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
      dataTypeIDs: {
        maxTemperature: "DLY-TMAX-NORMAL",
        minTemperature: "DLY-TMIN-NORMAL",
        chanceOfPercipitation: "DLY-PRCP-PCTALL-GE001HI",
        chanceOfHeavyPercipitation: "DLY-PRCP-PCTALL-GE050HI",
        chanceOfSnow: "DLY-SNOW-PCTALL-GE001TI",
        chanceOfHeavySnow: "DLY-SNOW-PCTALL-GE030TI",
        chanceOfSnowPack: "DLY-SNWD-PCTALL-GE001WI",
        chanceOfHeavySnowPack: "DLY-SNWD-PCTALL-GE010WI"
      }
    }).then(response => {
      return dispatch({type: 'SET_WEATHER_DATA', ...response, id: trail.id});
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
