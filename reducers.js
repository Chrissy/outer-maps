import { combineReducers } from 'redux';
import {cumulativeElevationChanges} from './cumulativeElevationChanges'

const lastHoveredTrail = (state = null, action) => {
  switch (action.type) {
    case 'ADD_HOVERED_TRAIL':
      return action.trail;
    case 'REMOVE_HOVERED_TRAIL':
      return {};
    default: return state;
  };
};

const tooltipVisibility = (state = false, action) => {
  switch (action.type) {
    case 'HIDE_TOOLTIP':
      return false;
    case 'SHOW_TOOLTIP':
      return true;
    default: return state;
  };
};

const activeTrails = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return [...state, action.trail];
    case 'CLEAR_ACTIVE_TRAILS':
      return [];
    default: return state;
  };
};

const activeTrailsElevationChanges = (state = {elevationGain: 0, elevationLoss: 0}, action) => {
  switch (action.type) {
    case 'SET_TRAILS_ELEVATION_CHANGES':
      return action.elevationChanges;
    default: return state;
  }
}

const activeTrailsDistance = (state = 0, action) => {
  switch (action.type) {
    case 'SET_TRAILS_LENGTH':
      return action.distance;
    default: return state;
  }
}

const trailsDataUrl = (state = false, action) => {
  switch (action.type) {
    case 'SET_TRAILS_DATA_URL_BOUNDS':
      return `/api/${action.bounds._sw.lng}/${action.bounds._sw.lat}/${action.bounds._ne.lng}/${action.bounds._ne.lat}`;
    default: return state;
  };
};

export default combineReducers({
  lastHoveredTrail,
  tooltipVisibility,
  activeTrails,
  activeTrailsElevationChanges,
  activeTrailsDistance,
  trailsDataUrl
});
