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
      /*
        selectedId is the trail's index in a multi-trail route.
        this can be changed by the user.
      */
      selectedId: action.selectedTrailCount - 1,
      active: true
    };
  case "SET_TRAIL_ACTIVE":
    /*
      sets trail as active for editing and viewing
    */

    if (state.uniqueId !== action.uniqueId)
      return {
        ...state,
        active: false
      };

    return {
      ...state,
      active: true
    };
  case "CLEAR_TRAIL_ACTIVE":
    return {
      ...state,
      active: false
    };
  case "SELECT_TRAIL":
    /*
      selects a trail that has already been added but is not currently active
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
      selectedId: action.selectedTrailCount - 1
    };
  case "SET_TRAIL_SELECTED_ID":
    if (state.selectedId !== 0 && !state.selectedId) return state;

    /* if this is the element to be moved, do so */
    if (state.selectedId == action.sourceIndex)
      return {
        ...state,
        selectedId: action.destinationIndex
      };

      /* only change the indeces between the move */
    if (
      state.selectedId <
          Math.min(action.sourceIndex, action.destinationIndex) ||
        state.selectedId > Math.max(action.sourceIndex, action.destinationIndex)
    )
      return state;

      /* determine the operator based on the direction of the move */
    return {
      ...state,
      selectedId:
          state.selectedId +
          (action.destinationIndex > action.sourceIndex ? -1 : 1)
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
      handles: null,
      reversed: false
    };
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
      reversed: !state.reversed
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
    return [
      ...state,
      trail(undefined, {
        ...action,
        selectedTrailCount: state.filter(e => e.selected).length + 1
      })
    ];
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
  case "SET_TRAIL_SELECTED_ID":
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
        totalPoints: action.points.length,
        index: 0
      }),
      handle(null, {
        ...action,
        type: "ADD_HANDLE",
        point: action.points[action.points.length - 1].coordinates,
        totalPoints: action.points.length,
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
  case "PROGRESS_TRAIL_CUT":
  case "FINISH_TRAIL_CUT":
  case "CANCEL_TRAIL_CUT":
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
      totalPoints: action.totalPoints,
      trailId: action.id,
      uniqueId: action.uniqueId
    };
  case "PROGRESS_TRAIL_CUT":
    if (
      state.handleId !== action.cuttingStep - 1 ||
        action.uniqueId !== state.uniqueId
    )
      return state;
    return {
      ...state,
      activelyCutting: true,
      cuttingStep: action.cuttingStep >= 2 ? null : action.cuttingStep,
      previousCoordinates: state.coordinates,
      previousIndex: state.index
    };
  case "CANCEL_TRAIL_CUT":
    if (action.uniqueId !== state.uniqueId) return state;
    return {
      ...state,
      activelyCutting: false,
      cuttingStep: null,
      coordinates:
          state.previousCoordinates ||
          state.originalCoordinates ||
          state.coordinates,
      index:
          state.previousIndex == 0
            ? state.previousIndex
            : state.previousIndex || state.index,
      previousCoordinates: null,
      originalCoordinates: null,
      previousIndex: null
    };
  case "FINISH_TRAIL_CUT":
    if (action.uniqueId !== state.uniqueId) return state;
    return {
      ...state,
      activelyCutting: false,
      cuttingStep: null,
      previousCoordinates: null,
      previousIndex: null,
      coordinates: state.previousCoordinates || state.coordinates
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
      index: action.index,
      activelyCutting: false,
      previousCoordinates: null,
      originalCoordinates: state.previousCoordinates
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
