import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {getDataFromNearestStation} from '../modules/NOAA';

function getTrailData(trail) {
  return (dispatch) => {
    if (trail.hasElevationData) return Promise.resolve();
    return fetch(`/api/elevation/${trail.id}`)
      .then(response => response.json())
      .then(elevations => {
        const coordinates = elevations.map(e => e.coordinates);
        dispatch({type: 'SET_TRAIL_DATA', elevations, coordinates, id: trail.id});
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

export function previewTrail(trail) {
  return dispatch => {
    dispatch({type: 'CLEAR_BOUNDARY_PREVIEWING'});
    dispatch({type: 'ADD_TRAIL', ...trail});
    return dispatch({type: 'SET_TRAIL_PREVIEWING', id: trail.properties.id});
  };
};

export function selectTrail(trail) {
  return (dispatch, getState) => {
    const props = trail.properties
    const cachedTrail = getState().trails.find(t => t.id == props.id);
    if (!cachedTrail) dispatch({type: 'ADD_TRAIL', ...trail});
    trail = getState().trails.find(t => t.id == props.id);
    dispatch({type: 'CLEAR_BOUNDARY_SELECTED'});
    dispatch({type: 'TOGGLE_TRAIL_SELECTED', ...trail});
    dispatch({type: 'SHOW_HANDLES', ...trail});
    dispatch(getTrailData(trail));
    return dispatch(getWeatherData(trail));
  };
};

export function previewBoundary(boundary) {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_PREVIEWING'});
    dispatch({type: 'ADD_BOUNDARY', ...boundary});
    return dispatch({type: 'SET_BOUNDARY_PREVIEWING', ...boundary});
  };
};

export function selectBoundary(id) {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_SELECTED'});
    dispatch({type: 'CLEAR_HANDLES'});
    return dispatch({type: 'SET_BOUNDARY_SELECTED', id});
  };
};

export function addSource(source){
  return dispatch => {
    return dispatch({type: 'ADD_SOURCE', ...source});
  };
};

export function clearPreviewing() {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_PREVIEWING'});
    dispatch({type: 'CLEAR_BOUNDARY_PREVIEWING'});
  }
}

export function clearSelected() {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_SELECTED'});
    dispatch({type: 'CLEAR_BOUNDARY_SELECTED'});
    dispatch({type: 'CLEAR_HANDLES'})
  }
}
