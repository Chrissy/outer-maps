import { combineReducers } from 'redux'
import {cumulativeElevationChanges} from './cumulativeElevationChanges'

const trail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return action.trail
    case 'TOGGLE_PREVIEWING':
      if (action.id !== state.id) return state
      return { ...state, previewing: true }
    case 'CLEAR_PREVIEWING':
      return { ...state, previewing: false }
    case 'TOGGLE_VIEWING':
      if (action.id !== state.id) return { ...state, viewing: false }
      return {...state, viewing: true }
    case 'TOGGLE_SELECTED':
      if (action.id !== state.id) return state
      return { ...state, selected: !state.selected }
    case 'CLEAR_SELECTED':
      return { ...state, selected: false }
    case 'SET_ELEVATION_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasElevationData: true,
        elevationGain: action.elevationChanges.elevationGain,
        elevationLoss: action.elevationChanges.elevationLoss,
        distance: action.distance
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
    case 'TOGGLE_VIEWING':
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

const trailsDataUrl = (state = false, action) => {
  switch (action.type) {
    case 'SET_TRAILS_DATA_URL_BOUNDS':
      return `/api/${action.bounds._sw.lng}/${action.bounds._sw.lat}/${action.bounds._ne.lng}/${action.bounds._ne.lat}`
    default: return state
  }
}

export default combineReducers({
  trail,
  trails,
  trailsDataUrl
})
