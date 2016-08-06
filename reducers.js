import { combineReducers } from 'redux';

const lastHoveredTrail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_HOVERED_TRAIL':
      return action.trail;
    case 'REMOVE_HOVERED_TRAIL':
      return {};
    default: return state;
  }
};

const tooltipVisibility = (state = false, action) => {
  switch (action.type) {
    case 'HIDE_TOOLTIP':
      return false;
    case 'SHOW_TOOLTIP':
      return true;
    default: return state;
  }
}

const activeTrails = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return [...state, action.trail]
    case 'REMOVE_TRAIL':
      return [...state.slice(0, action.trail),
              ...state.slice(action.trail + 1)]
    default: return state;
  }
}

export default combineReducers({lastHoveredTrail, tooltipVisibility, activeTrails});
