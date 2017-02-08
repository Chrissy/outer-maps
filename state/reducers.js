import { combineReducers } from 'redux'

const trail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return action.trail
    case 'TOGGLE_PREVIEWING':
      if (action.trail.id !== state.id) return { ...state, previewing: false }
      return { ...state, previewing: true }
    case 'CLEAR_PREVIEWING':
      return { ...state, previewing: false }
    case 'TOGGLE_SELECTED':
      if (action.trail.id !== state.id) return { ...state, selected: false }
      return { ...state, selected: !state.selected }
    case 'CLEAR_SELECTED':
      return { ...state, selected: false }
    case 'SET_ELEVATION_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasElevationData: true,
        elevationGain: action.elevationChanges.elevationGain,
        elevationLoss: action.elevationChanges.elevationLoss,
        elevations: action.elevationChanges.elevations
      }
    default: return state
  }
}

const trails = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return [...state, trail(undefined, action)]
    case 'TOGGLE_PREVIEWING':
      return state.map(t => trail(t, action))
    case 'CLEAR_PREVIEWING':
      return state.map(t => trail(t, action))
    case 'TOGGLE_SELECTED':
      return state.map(t => trail(t, action))
    case 'CLEAR_SELECTED':
      return state.map(t => trail(t, action))
    case 'SET_ELEVATION_DATA':
      return state.map(t => trail(t, action))
    default: return state
  }
}

const viewBox = (state = false, action) => {
  switch (action.type) {
    case 'SET_VIEWBOX':
      return {
        sw1: action.bounds._sw.lng,
        sw2: action.bounds._sw.lat,
        ne1: action.bounds._ne.lng,
        ne2: action.bounds._ne.lat
      }
    default: return state
  }
}

export default combineReducers({
  trail,
  trails,
  viewBox
})
