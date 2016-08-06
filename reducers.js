import { combineReducers } from 'redux';

const lastHoveredTrail = (state = {}, action) => {
  switch (action.type) {
    case 'SWAP_IN_TRAIL':
      return action.trail
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

export default combineReducers({lastHoveredTrail, tooltipVisibility});
