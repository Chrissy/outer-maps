import { combineReducers } from "redux";
import distance from "@turf/distance";
import { lineString } from "@turf/helpers";

const trail = (state = {}, action) => {
  switch (action.type) {
  case "ADD_TRAIL":
    return {
      hasBaseData: true,
      id: action.id,
      /*
        Trails can be added many times, and therefore need
        a front-end specific unique identifier
      */
      uniqueId: action.uniqueId,
      name: action.name,
      distance: action.distance,
      stationId: action.station1,
      center: action.center,
      bounds: action.bounds,
      /*
        add trail also selects the trail. it fires
        the first time a trail is selected or when a
        second segment is added from the same trail
      */
      selected: true,
      active: true
    };
  case "SELECT_TRAIL":
    /*
      selects a trail that has already been added
    */
    if (state.uniqueId !== action.uniqueId)
      return {
        ...state,
        active: false
      };

    return {
      ...state,
      selected: true,
      active: true,
      /*
        selectedId is the trail's index in a multi-trail route.
        this can be changed by the user.
      */
      selectedId: action.selectedTrailCount
    };
  case "DUPLICATE_TRAIL":
    return {
      ...action
    };
  case "UNSELECT_TRAIL":
    if (state.uniqueId === action.uniqueId && state.selected) {
      /*
        if this is the clicked trail, then we should remove
        it's selected status and index
      */
      return { ...state, selected: false, active: false, selectedId: null };
    } else if (state.selected && state.selectedId > action.selectedId) {
      /*
        if it is any other selected trail whose index is greater
        than the removed item's index, we should bump it down
      */
      return { ...state, selectedId: state.selectedId - 1 };
    }
    return state;
  case "CLEAR_TRAIL_SELECTED":
    return {
      ...state,
      selected: false,
      active: false,
      selectedId: null,
      handles: null
    };
  case "SET_TRAIL_ACTIVE":
    return { ...state, active: state.id == action.id };
  case "CLEAR_TRAIL_ACTIVE":
    return { ...state, active: false };
  case "SET_TRAIL_ELEVATION_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      hasElevationData: true,
      geometry: lineString(action.points.map(p => p.coordinates)).geometry,
      points: action.points.map((e, i) => {
        const p = action.points[i - 1];
        return {
          coordinates: e.coordinates,
          id: action.id,
          index: i,
          elevation: e.elevation,
          elevationGain: p ? Math.max(e.elevation - p.elevation, 0) : 0,
          elevationLoss: p
            ? Math.abs(Math.min(e.elevation - p.elevation, 0))
            : 0,
          distanceFromPreviousPoint: p
            ? distance(e.coordinates, p.coordinates) * 1000
            : 0
        };
      })
    };
  case "SET_TRAIL_ELEVATION_DATA_REQUESTED":
    if (action.id !== state.id) return state;
    return { ...state, elevationDataRequested: true };
  case "REVERSE_TRAIL":
    if (action.uniqueId !== state.uniqueId) return state;
    return {
      ...state,
      points: state.points.reverse()
    };
  case "SET_TRAIL_WEATHER_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      hasWeatherData: true,
      weatherData: {
        maxTemperature: action["DLY-TMAX-NORMAL"],
        minTemperature: action["DLY-TMIN-NORMAL"],
        chanceOfPercipitation: action["DLY-PRCP-PCTALL-GE001HI"],
        chanceOfHeavyPercipitation: action["DLY-PRCP-PCTALL-GE050HI"]
      }
    };
  case "SET_TRAIL_ADDITIONAL_WEATHER_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      hasAdditionalWeatherData: true,
      chanceOfSnow: action["DLY-SNOW-PCTALL-GE001TI"],
      chanceOfHeavySnow: action["DLY-SNOW-PCTALL-GE030TI"],
      chanceOfSnowPack: action["DLY-SNWD-PCTALL-GE001WI"],
      chanceOfHeavySnowPack: action["DLY-SNWD-PCTALL-GE010WI"]
    };
  default:
    return state;
  }
};

const trails = (state = [], action) => {
  switch (action.type) {
  case "ADD_TRAIL":
  case "DUPLICATE_TRAIL":
    return [...state, trail(undefined, action)];
  case "SELECT_TRAIL":
    return state.map(t =>
      trail(t, {
        ...action,
        selectedTrailCount: state.filter(e => e.selected).length + 1
      })
    );
  case "CLEAR_TRAIL_SELECTED":
  case "CLEAR_SELECTED":
  case "ADD_BOUNDARY":
  case "SELECT_BOUNDARY":
    return state.map(t =>
      trail(t, { ...action, type: "CLEAR_TRAIL_SELECTED" })
    );
  case "UNSELECT_TRAIL":
  case "SET_TRAIL_ELEVATION_DATA":
  case "SET_TRAIL_ELEVATION_DATA_REQUESTED":
  case "SET_TRAIL_WEATHER_DATA":
  case "SET_TRAIL_WEATHER_DATA_REQUESTED":
  case "SET_TRAIL_ADDITIONAL_WEATHER_DATA":
  case "SET_TRAIL_ACTIVE":
  case "CLEAR_TRAIL_ACTIVE":
  case "REVERSE_TRAIL":
    return state.map(t => trail(t, action));
  default:
    return state;
  }
};

const boundaries = (state = [], action) => {
  switch (action.type) {
  case "ADD_BOUNDARY":
    if (state.some(b => b.id == action.id)) return state;
    return [
      ...state.map(b => ({ ...b, selected: false })),
      boundary(undefined, action)
    ];
  case "SET_BOUNDARY_ELEVATION_DATA":
  case "SET_BOUNDARY_ELEVATION_DATA_REQUESTED":
  case "SET_BOUNDARY_WEATHER_DATA":
  case "SET_BOUNDARY_WEATHER_DATA_REQUESTED":
  case "SET_BOUNDARY_ADDITIONAL_WEATHER_DATA":
  case "SELECT_BOUNDARY":
    return state.map(b => boundary(b, action));
  case "CLEAR_BOUNDARY_SELECTED":
  case "CLEAR_SELECTED":
  case "ADD_TRAIL":
  case "SELECT_TRAIL":
    return state.map(b =>
      boundary(b, { ...action, type: "CLEAR_BOUNDARY_SELECTED" })
    );
  default:
    return state;
  }
};

const boundary = (state = {}, action) => {
  switch (action.type) {
  case "ADD_BOUNDARY":
    return {
      ...state,
      id: action.properties.id,
      name: action.properties.name,
      bounds: action.bounds,
      hasBaseData: true,
      selected: true
    };
  case "SET_BOUNDARY_ELEVATION_DATA_REQUESTED":
    if (action.id !== state.id) return state;
    return { ...state, elevationDataRequested: true };
  case "SET_BOUNDARY_ELEVATION_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      area: action.area,
      trailsCount: action.trailsCount,
      trailLengths: action.trailLengths,
      trailTypes: action.trailTypes,
      trails: action.trails,
      highPoint: action.highPoint,
      hasElevationData: true
    };
  case "SET_BOUNDARY_WEATHER_DATA_REQUESTED":
    if (action.id !== state.id) return state;
    return { ...state, weatherDataRequested: true };
  case "SET_BOUNDARY_WEATHER_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      hasWeatherData: true,
      weatherData: {
        maxTemperature: action["DLY-TMAX-NORMAL"],
        minTemperature: action["DLY-TMIN-NORMAL"],
        chanceOfPercipitation: action["DLY-PRCP-PCTALL-GE001HI"],
        chanceOfHeavyPercipitation: action["DLY-PRCP-PCTALL-GE050HI"]
      }
    };
  case "SET_BOUNDARY_ADDITIONAL_WEATHER_DATA":
    if (action.id !== state.id) return state;
    return {
      ...state,
      hasAdditionalWeatherData: true,
      chanceOfSnow: action["DLY-SNOW-PCTALL-GE001TI"],
      chanceOfHeavySnow: action["DLY-SNOW-PCTALL-GE030TI"],
      chanceOfSnowPack: action["DLY-SNWD-PCTALL-GE001WI"],
      chanceOfHeavySnowPack: action["DLY-SNWD-PCTALL-GE010WI"]
    };
  case "SELECT_BOUNDARY":
    return { ...state, selected: state.id === action.id };
  case "CLEAR_BOUNDARY_SELECTED":
    return { ...state, selected: false };
  default:
    return state;
  }
};

const handles = (state = [], action) => {
  switch (action.type) {
  case "SELECT_TRAIL":
  case "SET_TRAIL_ELEVATION_DATA":
  case "DUPLICATE_TRAIL":
    return [
      ...state,
      handle(null, {
        ...action,
        type: "ADD_HANDLE",
        point: action.points[0].coordinates,
        handleId: 0,
        index: 0
      }),
      handle(null, {
        ...action,
        type: "ADD_HANDLE",
        point: action.points[action.points.length - 1].coordinates,
        handleId: 1,
        index: action.points.length
      })
    ];
  case "CLEAR_TRAIL_SELECTED":
  case "CLEAR_SELECTED":
  case "ADD_BOUNDARY":
  case "SELECT_BOUNDARY":
    return [];
  case "UNSELECT_TRAIL":
    return state.filter(h => h.uniqueId !== action.uniqueId);
  case "UPDATE_HANDLE":
  case "SET_HANDLE_INDEX":
  case "REVERSE_TRAIL":
    return state.map(h => handle(h, action));
  default:
    return state;
  }
};

const handle = (state = {}, action) => {
  switch (action.type) {
  case "ADD_HANDLE":
    return {
      coordinates: action.point,
      id: action.uniqueId + "-" + action.handleId,
      handleId: action.handleId,
      index: action.index,
      trailId: action.id,
      uniqueId: action.uniqueId
    };
  case "UPDATE_HANDLE":
    if (action.id !== state.id) return state;
    return {
      ...state,
      coordinates: action.coordinates
    };
  case "SET_HANDLE_INDEX":
    if (action.id !== state.id) return state;
    return {
      ...state,
      index: action.index
    };
  case "REVERSE_TRAIL":
    if (action.uniqueId !== state.uniqueId) return state;
    return {
      ...state,
      handleId: state.handleId == 0 ? 1 : 0
    };
  default:
    return state;
  }
};

export default combineReducers({
  trails,
  boundaries,
  handles
});
