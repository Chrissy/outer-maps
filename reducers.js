import { combineReducers } from 'redux';

const lastHoveredTrailInitialState = {
  name: '',
  source: '',
  contactX: 0,
  contactY: 0
};

const lastHoveredTrail = (state = lastHoveredTrailInitialState, action) => {
  switch (action.type) {
    case 'SWAP_HOVERED_TRAIL':
      return {
        trailID: action.trailID,
        contactX: action.contactX,
        contactY: action.contactY
      };
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
