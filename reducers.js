import { combineReducers } from 'redux';

const lastHoveredTrailInitialState = [
  {
    name: '',
    source: '',
    contactX: 0,
    contactY: 0,
  }
];

const lastHoveredTrail = (state = lastHoveredTrailInitialState, action) => {
  switch (action.type) {
    case 'SWAP_IN_TRAIL':
      return {
        name: action.name,
        source: action.source,
        contactX: action.contactX,
        contactY: action.contactY,
        visible: true
      };
    default: return state;
  }
};

const tooltipVisibilityInitialState = [
  { visibility: false }
]

const tooltipVisibility = (state = tooltipVisibilityInitialState, action) => {
  switch (action.type) {
    case 'HIDE_TOOLTIP':
      return { visiblity: false };
    case 'SHOW_TOOLTIP':
      return { visiblity: true };
    default: return state;
  }
}

export default combineReducers({lastHoveredTrail, tooltipVisibility});
