import bbox from "@turf/bbox";
import GeoViewport from "@mapbox/geo-viewport";
import { getWeather } from "../services/getNOAAWeather";
import fetchWithCache from "../services/fetchWithCache";

const selectTrail = ({ properties, geometry, activeSegment }) => {
  return (dispatch, getState) => {
    const storedTrails = getState().trails;
    const cachedTrail = storedTrails.find(t => t.id == properties.id);
    const uniqueId = storedTrails.length + 1;

    dispatch({ type: "CLEAR_TRAIL_ACTIVE" });

    if (cachedTrail) {
      /*
        if the segment is already selected, then we set it to a focus
        state for flipping, cutting, etc.
      */
      if (activeSegment)
        return dispatch({
          ...cachedTrail,
          type: "SET_TRAIL_ACTIVE",
          uniqueId: properties.uniqueId
        });
      /*
      if no segments are selected, but the trail is cached, then
      simply set the cached trail as selected
      */
      if (!cachedTrail.selected)
        return dispatch({
          type: "SELECT_TRAIL",
          ...cachedTrail,
          id: properties.id
        });
      /*
      if the clicked segment is not selected, but the cached trail
      indicates that a segement has been selected, then dup the trail
      */
      return dispatch({
        type: "DUPLICATE_TRAIL",
        ...cachedTrail,
        id: properties.id,
        uniqueId
      });
    } else {
      const bounds = bbox(JSON.parse(properties.bounds));
      const { center } = GeoViewport.viewport(bounds, [1024, 800]);

      dispatch({
        ...properties,
        center,
        bounds,
        geometry,
        uniqueId,
        type: "ADD_TRAIL"
      });
      dispatch(getElevationData({ ...properties, reducer: "trail", uniqueId }));
      dispatch(getWeatherData({ ...properties, center, reducer: "trail" }));
    }
  };
};

const selectBoundary = ({ properties, geometry }) => {
  return (dispatch, getState) => {
    const cachedBoundary = getState().boundaries.find(
      b => b.id == properties.id
    );
    const bounds = bbox(JSON.parse(properties.bounds));

    if (!cachedBoundary)
      dispatch({ type: "ADD_BOUNDARY", properties, geometry, bounds });
    if (!cachedBoundary || !cachedBoundary.elevationDataRequested)
      dispatch(getElevationData({ id: properties.id, reducer: "boundary" }));
    if (!cachedBoundary || !cachedBoundary.weatherDataRequested)
      dispatch(
        getWeatherData({
          ...properties,
          center: geometry.coordinates,
          reducer: "boundary"
        })
      );
    if (cachedBoundary)
      return dispatch({ type: "SELECT_BOUNDARY", id: properties.id });
  };
};

const unselectTrail = uniqueId => {
  return dispatch => {
    dispatch({ type: "REMOVE_TRAIL_HANDLES", uniqueId });
    return dispatch({ type: "UNSELECT_TRAIL", uniqueId });
  };
};

const clearSelected = () => {
  return dispatch => dispatch({ type: "CLEAR_SELECTED" });
};

const getElevationData = ({ id, reducer, uniqueId }) => {
  return dispatch => {
    dispatch({
      type: `SET_${reducer.toUpperCase()}_ELEVATION_DATA_REQUESTED`,
      id
    });

    return fetchWithCache({ path: `/api/${reducer}/${id}`, extension: "json" })
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: `SET_${reducer.toUpperCase()}_ELEVATION_DATA`,
          ...response,
          id,
          uniqueId
        });
      });
  };
};

const getWeatherData = ({ id, center, station1, reducer }) => {
  return dispatch => {
    dispatch({
      type: `SET_${reducer.toUpperCase()}_WEATHER_IMAGE_REQUESTED`,
      id
    });
    getWeather({
      x: center[1],
      y: center[0],
      stationId: station1,
      dataSetId: "NORMAL_DLY",
      dataTypeIds: [
        "DLY-TMAX-NORMAL",
        "DLY-TMIN-NORMAL",
        "DLY-PRCP-PCTALL-GE001HI",
        "DLY-PRCP-PCTALL-GE050HI"
      ]
    }).then(response => {
      return dispatch({
        type: `SET_${reducer.toUpperCase()}_WEATHER_DATA`,
        ...response,
        id: id
      });
    });
  };
};

const setBothWays = id => {
  /* this is annoyingly similar to selectTrail but somewhat simpler */
  return (dispatch, getState) => {
    const storedTrails = getState().trails;
    const cachedTrail = storedTrails.find(t => t.id == id);
    const uniqueId = storedTrails.length + 1;

    dispatch({ type: "DUPLICATE_TRAIL", ...cachedTrail, uniqueId });
    dispatch({ type: "REVERSE_TRAIL", uniqueId });
    return dispatch({ type: "SET_TRAIL_ACTIVE", uniqueId });
  };
};

export {
  selectTrail,
  selectBoundary,
  unselectTrail,
  clearSelected,
  setBothWays
};
