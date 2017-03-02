import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {rollingAverage, glitchDetector} from '../modules/cumulativeElevationChanges';
import {getDataFromNearestStation} from '../modules/NOAA';

function getTrail(id) {
  return (dispatch, getState) => {
    let cachedTrail = getState().trails.find(trail => trail.id == id);

    if (cachedTrail) return Promise.resolve(cachedTrail);

    dispatch({type: 'ADD_TRAIL', id});

    return fetch(`/api/trails/${id}`).then(response => {
      return response.json();
    }).then(t => {
        const trail = Object.assign({}, t)
        dispatch({type: 'SET_TRAIL_BASE_DATA', trail});
        return trail;
    });
  };
};

function getBoundary(id) {
  return (dispatch, getState) => {
    let cachedBoundary = getState().boundaries.find(boundary => boundary.id == id);

    if (cachedBoundary) return Promise.resolve(cachedBoundary);

    dispatch({type: 'ADD_BOUNDARY', id});

    return fetch(`/api/boundaries/${id}`).then(response => {
      return response.json();
    }).then(b => {
      const boundary = Object.assign({}, b);
      dispatch({type: 'SET_BOUNDARY_BASE_DATA', ...boundary});
      return boundary;
    });
  }
}

function getAltitudeData(trail) {
  return (dispatch, getState) => {
    if (trail.hasElevationData) return Promise.resolve();
    return fetch(`/api/elevation/${trail.id}`)
      .then(response => response.json())
      .then(elevationData => {
        const elevations = rollingAverage(glitchDetector(elevationData), 15);
        return dispatch({type: 'SET_ELEVATION_DATA', elevations, id: trail.id});
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
    dispatch(getTrail(id)).then(trail => {
      return dispatch({type: 'TOGGLE_TRAIL_PREVIEWING', trail});
    });
  };
};

export function selectTrail(id) {
  return dispatch => {
    dispatch({type: 'CLEAR_BOUNDARY_SELECTED'});
    dispatch(getTrail(id)).then(trail => {
      dispatch({type: 'TOGGLE_TRAIL_SELECTED', trail});
      dispatch(getAltitudeData(trail));
      dispatch(getWeatherData(trail));
    });
  };
};

export function previewBoundary(id) {
  return dispatch => {
    dispatch(getBoundary(id)).then(boundary => {
      return dispatch({type: 'SET_BOUNDARY_PREVIEWING', ...boundary});
    });
  };
};

export function selectBoundary(id) {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_SELECTED'});
    dispatch(getBoundary(id)).then(boundary => {
      dispatch({type: 'SET_BOUNDARY_SELECTED', ...boundary});
    });
  };
};

export function addSource(source){
  return dispatch => {
    return dispatch({type: 'ADD_SOURCE', ...source});
  };
};

export function updateView(viewBox, zoom) {
  return dispatch => {
    return dispatch({type: 'UPDATE_VIEW', viewBox, zoom});
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
  }
}
