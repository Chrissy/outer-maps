import {getNoaaData} from '../modules/NOAA';
import requestSatelliteImage from '../modules/getSatelliteImage';
import GeoViewport from '@mapbox/geo-viewport';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';

const selectTrail = ({properties, geometry}) => {
  return (dispatch, getState) => {
    const cachedTrail = getState().trails.find(t => t.id == properties.id);
    const center = centroid(geometry).geometry.coordinates;
    const bounds = bbox(geometry);

    if (!cachedTrail) dispatch({type: 'ADD_TRAIL', center, bounds, properties, geometry});
    if (!cachedTrail || !cachedTrail.elevationDataRequested) dispatch(getElevationData({id: properties.id, bounds, reducer: 'trail'}));
    if (!cachedTrail || !cachedTrail.weatherDataRequested) dispatch(getWeatherData({...properties, center, reducer: 'trail'}));
    if (!cachedTrail || !cachedTrail.satelliteImageRequested) dispatch(getSatelliteImage({id: properties.id, bounds, reducer: 'trail'}));
    if (cachedTrail) return  dispatch({type: 'SELECT_TRAIL', ...cachedTrail});
  };
};

const selectBoundary = ({properties, geometry}) => {
  return (dispatch, getState) => {
    const cachedBoundary = getState().boundaries.find(b => b.id == properties.id);
    const bounds = bbox(JSON.parse(properties.bounds));

    if (!cachedBoundary) dispatch({type: 'ADD_BOUNDARY', properties, geometry, bounds});
    if (!cachedBoundary || !cachedBoundary.elevationDataRequested) dispatch(getElevationData({id: properties.id, bounds, reducer: 'boundary'}));
    if (!cachedBoundary || !cachedBoundary.weatherDataRequested) dispatch(getWeatherData({...properties, center: geometry.coordinates, reducer: 'boundary'}));
    if (!cachedBoundary || !cachedBoundary.satelliteImageRequested) dispatch(getSatelliteImage({id: properties.id, bounds, reducer: 'boundary'}));
    if (cachedBoundary) return dispatch({type: 'SELECT_BOUNDARY', id: properties.id});
  };
};

const unselectTrail = (id) => {
  return dispatch => {
    dispatch({type: 'REMOVE_TRAIL_HANDLES', id})
    return dispatch({type: 'UNSELECT_TRAIL', id});
  };
};

const clearSelected = () => {
  return dispatch => dispatch({type: 'CLEAR_SELECTED'});
};

const getElevationData = ({id, bounds, reducer}) => {
  return (dispatch) => {
    dispatch({type: `SET_${reducer.toUpperCase()}_ELEVATION_DATA_REQUESTED`, id });

    const view = GeoViewport.viewport(bounds, [1024, 1024], 12, 14);
    const tileBounds = GeoViewport.bounds(view.center, view.zoom, [1024, 1024]);

    return fetch(`/api/${reducer}/${id}/${tileBounds.join("/")}`)
      .then(response => response.json())
      .then(response => {
        dispatch({type: `SET_${reducer.toUpperCase()}_ELEVATION_DATA`, ...response, id });
      });
  };
};

const getSatelliteImage = ({id, bounds, reducer}) => {
  return dispatch => {
    dispatch({type: `SET_${reducer.toUpperCase()}_SATELLITE_IMAGE_REQUESTED`, id});
    requestSatelliteImage({bounds, minZoom: 12, maxZoom: 14}).then(image => {
      return dispatch({type:  `SET_${reducer.toUpperCase()}_SATELLITE_IMAGE`, id, url: URL.createObjectURL(image)});
    });
  };
};

const getWeatherData = ({id, center, stationId, reducer}) => {
  return dispatch => {
    dispatch({type: `SET_${reducer.toUpperCase()}_WEATHER_IMAGE_REQUESTED`, id});
    getNoaaData({
      x: center[1],
      y: center[0],
      stationId: stationId,
      dataSetId: "NORMAL_DLY",
      dataTypeIds: [
        "DLY-TMAX-NORMAL",
        "DLY-TMIN-NORMAL",
        "DLY-PRCP-PCTALL-GE001HI",
        "DLY-PRCP-PCTALL-GE050HI"
      ]
    }).then(response => {
      return dispatch({type: `SET_${reducer.toUpperCase()}_WEATHER_DATA`, ...response, id: id});
    });
  };
};

const getAdditionalWeatherData = ({id, center, stationId, hasWeatherData, reducer}) => {
  return dispatch => {
    getNoaaData({
      x: center[1],
      y: center[0],
      dataSetID: "NORMAL_DLY",
      dataTypeIDs: [
        "DLY-SNOW-PCTALL-GE001TI",
        "DLY-SNOW-PCTALL-GE030TI",
        "DLY-SNWD-PCTALL-GE001WI",
        "DLY-SNWD-PCTALL-GE010WI"
      ]
    }).then(response => {
      return dispatch({type: `SET_${reducer.toUpperCase()}_ADDITIONAL_WEATHER_DATA`, ...response, id: id});
    });
  };
};

export {selectTrail, selectBoundary, unselectTrail, clearSelected};
