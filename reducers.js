import { combineReducers } from 'redux';

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

const trailsDataUrl = (state = false, action) => {
  switch (action.type) {
    case 'SET_TRAILS_DATA_URL_BOUNDS':
      return `/api/${action.bounds._sw.lng}/${action.bounds._sw.lat}/${action.bounds._ne.lng}/${action.bounds._ne.lat}`;
    default: return state;
  };
};

export default combineReducers({lastHoveredTrail, tooltipVisibility, activeTrails, trailsDataUrl});
