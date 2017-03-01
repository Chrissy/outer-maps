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
        points: state.points.map((p, i) => point(p, {...action,
          elevation: action.elevations[i],
          pElevation: action.elevations[i - 1],
          pPoint: state.points[i - 1]
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
        elevationGain: Math.max(action.elevation - action.pElevation, 0) || 0,
        elevationLoss: Math.abs(Math.min(action.elevation - action.pElevation, 0)) || 0,
        distanceFromPreviousPoint: (!action.pPoint) ? 0 : Geolib.getDistance(state.coordinates, action.pPoint.coordinates)
      }
    default: return state
  }
}

const sources = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SOURCE':
      return [...state, source(undefined, action)]
    case 'UPDATE_VIEW':
      return state.map(l => source(l, action))
    default: return state
  }
}

const source = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_SOURCE':
      return {
        id: action.id,
        data: `api${action.endpoint}/${action.viewBox[0][0]}/${action.viewBox[0][1]}/${action.viewBox[1][0]}/${action.viewBox[1][1]}`,
        maxZoom: action.maxZoom,
        minZoom: action.minZoom,
        endpoint: action.endpoint,
        showing: action.zoom < action.maxZoom || action.zoom >= action.minZoom
      }
    case 'UPDATE_VIEW':
      return {...state,
        data: `api${state.endpoint}/${action.bounds[0][0]}/${action.bounds[0][1]}/${action.bounds[1][0]}/${action.bounds[1][1]}`,
        showing: action.zoom < state.maxZoom || action.zoom >= state.minZoom
      }
    default: return state
  }
}

export default combineReducers({
  trails,
  sources
})
