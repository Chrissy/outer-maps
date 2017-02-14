import { combineReducers } from 'redux';
import Geolib from 'geolib';
import _ from 'underscore';

const trail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return {...state, id: action.id}
    case 'SET_BASE_DATA':
      if (parseInt(action.trail.id) !== state.id) return state
      return {...state,
        name: action.trail.name,
        distance: action.trail.distance,
        center: action.trail.center,
        distance: action.trail.distance,
        geog: action.trail.geography,
        surface: action.trail.surface,
        points: _.flatten(action.trail.geography.coordinates, 1).map((coordinates) => point(undefined, {...action,
          coordinates: coordinates
        }))
      }
    case 'TOGGLE_PREVIEWING':
      return { ...state, previewing: (state.id === action.trail.id) }
    case 'CLEAR_PREVIEWING':
      return { ...state, previewing: false }
    case 'TOGGLE_SELECTED':
      if (state.id === action.trail.id && !action.trail.selected){
        return { ...state, selected: true, selectedId: action.selectedTrailCount};
      }
      return state;
    case 'CLEAR_SELECTED':
      return { ...state, selected: false, selectedId: null }
    case 'SET_ELEVATION_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasElevationData: true,
        elevationGain: action.elevationChanges.elevationGain,
        elevationLoss: action.elevationChanges.elevationLoss,
        points: state.points.map((p, i) => point(p, {...action,
          elevation: action.elevationChanges.elevations[i],
          distanceToNextPoint: (i == 0) ? 0 : Geolib.getDistance(p.coordinates, state.points[i - 1].coordinates)
        }))
      }
    case 'SET_WEATHER_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasWeatherData: true,
        maxTemperature: action.maxTemperature,
        minTemperature: action.minTemperature,
        chanceOfPercipitation: action.chanceOfPercipitation,
        chanceOfHeavyPercipitation: action.chanceOfHeavyPercipitation,
        chanceOfSnow: action.chanceOfSnow,
        chanceOfHeavySnow: action.chanceOfHeavySnow,
        chanceOfSnowPack: action.chanceOfSnowPack,
        chanceOfHeavySnowPack: action.chanceOfHeavySnowPack
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
      return state.map(t => trail(t, {...action, selectedTrailCount: state.filter(e => e.selected).length + 1}))
    case 'CLEAR_SELECTED':
      return state.map(t => trail(t, action))
    case 'SET_ELEVATION_DATA':
      return state.map(t => trail(t, action))
    case 'SET_BASE_DATA':
      return state.map(t => trail(t, action))
    case 'SET_WEATHER_DATA':
      return state.map(t => trail(t, action))
    default: return state
  }
}

const point = (state = {}, action) => {
  switch (action.type) {
    case 'SET_BASE_DATA':
      return {
        coordinates: action.coordinates
      }
    case 'SET_ELEVATION_DATA':
      return {...state,
        elevation: action.elevation,
        distanceToNextPoint: action.distanceToNextPoint
      }
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
  trails,
  trailsDataUrl
})
