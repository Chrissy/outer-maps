import { combineReducers } from 'redux';

const lastHoveredTrailID = (state = 0, action) => {
  switch (action.type) {
    case 'SWAP_HOVERED_TRAIL':
      return action.trailID
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

export default combineReducers({lastHoveredTrailID, tooltipVisibility});
