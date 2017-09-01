import fetch from 'isomorphic-fetch';
import _ from 'underscore'
import {getNoaaData} from '../modules/NOAA';
import GeoViewport from '@mapbox/geo-viewport';

function getTrailData(trail) {
  return (dispatch) => {
    if (trail.hasElevationData) return Promise.resolve();

    const view = GeoViewport.viewport(_.flatten(trail.bounds), [1024, 1024], 12, 14);
    const bounds = GeoViewport.bounds(view.center, view.zoom, [1024, 1024]);

    return fetch(`/api/elevation/${trail.id}/${bounds.join("/")}`)
      .then(response => response.json())
      .then(response => {
        const coordinates = response.elevations.map(e => e.coordinates);
        dispatch({type: 'SET_TRAIL_DATA', ...response, coordinates, id: trail.id });
        dispatch({type: 'SHOW_HANDLES', id: trail.id });
      });
  };
};

function getWeatherData(trail) {
  return dispatch => {
    if (trail.hasWeatherData) return Promise.resolve();

    getNoaaData({
      x: trail.center[1],
      y: trail.center[0],
      stationId: trail.stationId,
      dataSetId: "NORMAL_DLY",
      dataTypeIds: [
        "DLY-TMAX-NORMAL",
        "DLY-TMIN-NORMAL",
        "DLY-PRCP-PCTALL-GE001HI",
        "DLY-PRCP-PCTALL-GE050HI"
      ]
    }).then(response => {
      return dispatch({type: 'SET_WEATHER_DATA', ...response, id: trail.id});
    });
  }
}

export function getAdditionalWeatherData(trail) {
  return dispatch => {
    if (trail.hasAdditionalWeatherData) return Promise.resolve();

    getNoaaData({
      x: trail.center[1],
      y: trail.center[0],
      dataSetID: "NORMAL_DLY",
      dataTypeIDs: [
        ["DLY-SNOW-PCTALL-GE001TI"],
        ["DLY-SNOW-PCTALL-GE030TI"],
        ["DLY-SNWD-PCTALL-GE001WI"],
        ["DLY-SNWD-PCTALL-GE010WI"]
      ]
    }).then(response => {

      return dispatch({type: 'SET_ADDITIONAL_WEATHER_DATA', ...response, id: trail.id});
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
    dispatch({type: 'SELECT_TRAIL', ...trail});
    dispatch({type: 'SHOW_HANDLES', ...trail});
    dispatch(getTrailData(trail));
    return dispatch(getWeatherData(trail));
  };
};

export function unselectTrail(id) {
  return dispatch => {
    dispatch({type: 'REMOVE_TRAIL_HANDLES', id})
    return dispatch({type: 'UNSELECT_TRAIL', id});
  }
}

export function previewBoundary(boundary) {
  return dispatch => {
    dispatch({type: 'CLEAR_TRAIL_PREVIEWING'});
    dispatch({type: 'ADD_BOUNDARY', ...boundary});
    return dispatch({type: 'SET_BOUNDARY_PREVIEWING', ...boundary});
  };
};

function getBoundaryData({id, bounds}) {
  return dispatch => {
    const view = GeoViewport.viewport(_.flatten(bounds), [1024, 1024], 12, 14);
    const viewBounds = GeoViewport.bounds(view.center, view.zoom, [1024, 1024]);

    return fetch(`/api/boundaries/${id}/${viewBounds.join("/")}`)
      .then(response => response.json())
      .then(response => {
        dispatch({type: 'SET_BOUNDARY_DATA', ...response, id: id });
      });
  };
};

export function selectBoundary(boundary) {
  return (dispatch, getState) => {
    dispatch({type: 'CLEAR_TRAIL_SELECTED'});
    dispatch({type: 'CLEAR_HANDLES'});
    dispatch({type: 'SET_BOUNDARY_SELECTED', id: boundary.properties.id});
    dispatch({type: 'ADD_BOUNDARY', ...boundary});
    const cachedBoundary = getState().boundaries.find(b => b.id == boundary.properties.id);
    if (!cachedBoundary.hasElevationData) dispatch(getBoundaryData(cachedBoundary));    
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
