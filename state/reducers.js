import { combineReducers } from 'redux';
import Geolib from 'geolib';
import _ from 'underscore';

const trail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return {...state, id: action.id}
    case 'SET_TRAIL_BASE_DATA':
      if (parseInt(action.trail.id) !== state.id) return state
      return {...state,
        hasBaseData: true,
        name: action.trail.name,
        distance: action.trail.distance,
        center: action.trail.center,
        bounds: action.trail.bounds,
        geog: action.trail.geography,
        surface: action.trail.surface,
        points: action.trail.geography.coordinates.map((coordinates, index) => point(undefined, {...action,
          coordinates: coordinates,
          id: state.id,
          index: index
        }))
      }
    case 'TOGGLE_TRAIL_PREVIEWING':
      return { ...state, previewing: (state.id === action.trail.id) }
    case 'CLEAR_TRAIL_PREVIEWING':
      return { ...state, previewing: false }
    case 'TOGGLE_TRAIL_SELECTED':
      if (state.id === action.trail.id && !action.trail.selected){
        return { ...state, selected: true, selectedId: action.selectedTrailCount};
      }
      return state;
    case 'CLEAR_TRAIL_SELECTED':
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
    case 'SET_HANDLES':
      if (state.id !== action.id) return state;
      return { ...state,
        handles: [
          state.points[0],
          state.points[state.points.length - 1]
        ]
      }
    case 'UPDATE_HANDLE':
      if (!state.handles) return state;
      return {...state,
        handles: state.handles.map(p => point(p, action)),
      }
    case 'CLEAR_HANDLES':
        return { ...state,
        handles: []
      }
    default: return state
  }
}

const trails = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return [...state, trail(undefined, action)]
    case 'TOGGLE_TRAIL_PREVIEWING':
      return state.map(t => trail(t, action))
    case 'CLEAR_TRAIL_PREVIEWING':
      return state.map(t => trail(t, action))
    case 'TOGGLE_TRAIL_SELECTED':
      return state.map(t => trail(t, {...action, selectedTrailCount: state.filter(e => e.selected).length + 1}))
    case 'CLEAR_TRAIL_SELECTED':
      return state.map(t => trail(t, action))
    case 'SET_ELEVATION_DATA':
      return state.map(t => trail(t, action))
    case 'SET_TRAIL_BASE_DATA':
      return state.map(t => trail(t, action))
    case 'SET_WEATHER_DATA':
      return state.map(t => trail(t, action))
    case 'SET_HANDLES':
      return state.map(t => trail(t, action))
    case 'CLEAR_HANDLES':
      return state.map(t => trail(t, action))
    case 'UPDATE_HANDLE':
      return state.map(t => trail(t, action))
    default: return state
  }
}


const point = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TRAIL_BASE_DATA':
      return {
        coordinates: action.coordinates,
        id: action.id.toString() + action.index,
        trailId: action.id
      }
    case 'SET_ELEVATION_DATA':
      return {...state,
        elevation: action.elevation,
        elevationGain: Math.max(action.elevation - action.pElevation, 0) || 0,
        elevationLoss: Math.abs(Math.min(action.elevation - action.pElevation, 0)) || 0,
        distanceFromPreviousPoint: (!action.pPoint) ? 0 : Geolib.getDistance(state.coordinates, action.pPoint.coordinates)
      }
    case 'UPDATE_HANDLE':
      if (action.id !== state.id) return state;
      return {...state,
        coordinates: action.coordinates
      }
    default: return state
  }
}

const boundaries = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BOUNDARY':
      return [...state, boundary(undefined, action)]
    case 'SET_BOUNDARY_PREVIEWING':
      return state.map(b => boundary(b, action))
    case 'CLEAR_BOUNDARY_PREVIEWING':
      return state.map(b => boundary(b, action))
    case 'SET_BOUNDARY_SELECTED':
      return state.map(b => boundary(b, action))
    case 'CLEAR_BOUNDARY_SELECTED':
      return state.map(b => boundary(b, action))
    case 'SET_BOUNDARY_BASE_DATA':
      return state.map(b => boundary(b, action))
    default: return state
  }
}

const boundary = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_BOUNDARY':
      return {...state, id: action.id}
    case 'SET_BOUNDARY_BASE_DATA':
      if (action.id !== state.id) return state
      return {...state,
        name: action.name,
        area: action.area,
        center: action.center,
        bounds: action.bounds
      }
    case 'SET_BOUNDARY_PREVIEWING':
      return { ...state, previewing: (state.id === action.id) }
    case 'CLEAR_BOUNDARY_PREVIEWING':
      return { ...state, previewing: false }
    case 'SET_BOUNDARY_SELECTED':
      return { ...state, selected: (state.id === action.id)};
      return state;
    case 'CLEAR_BOUNDARY_SELECTED':
      return { ...state, selected: false }
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
  boundaries,
  sources
})
