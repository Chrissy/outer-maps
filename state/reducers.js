import { combineReducers } from 'redux';
import distance from '@turf/distance';
import {lineString} from '@turf/helpers';
import _ from 'underscore';

const trail = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      return {...state,
        hasBaseData: true,
        id: action.properties.id,
        name: action.properties.name,
        distance: action.properties.distance,
        stationId: action.properties.station1,
        center: action.center,
        bounds: action.bounds,
        selected: true
      }
    case 'SELECT_TRAIL':
      if (state.id === action.id && !state.selected){
        return { ...state, selected: true, selectedId: action.selectedTrailCount};
      }
      return state;
    case 'UNSELECT_TRAIL':
      if (state.id === action.id && state.selected) {
        return { ...state, selected: false, selectedId: null};
      } else if (state.selected && state.selectedId > action.selectedId) {
        return { ...state, selectedId: state.selectedId - 1 }
      }
      return state;
    case 'CLEAR_TRAIL_SELECTED':
      return { ...state, selected: false, selectedId: null, handles: null }
    case 'SET_TRAIL_DATA':
      if (action.id !== state.id) return state
      const points = action.points;
      return { ...state,
        hasElevationData: true,
        geometry: lineString(points.map(p => p.coordinates)).geometry,
        dump: action.dump,
        points: points.map((e, i) => {
          const p = points[i - 1];
          return {
            coordinates: e.coordinates,
            id: action.id,
            index: i,
            elevation: e.elevation,
            elevationGain: (p) ? Math.max(e.elevation - p.elevation, 0) : 0,
            elevationLoss: (p) ? Math.abs(Math.min(e.elevation - p.elevation, 0)) : 0,
            distanceFromPreviousPoint: (p) ? distance(e.coordinates, p.coordinates) * 1000 : 0
          }
        })
      }
    case 'SET_TRAIL_SATELLITE_IMAGE':
      if (action.id !== state.id) return state
      return {...state,
        hasSatelliteImage: true,
        satelliteImageUrl: action.url
      }
    case 'SET_TRAIL_WEATHER_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasWeatherData: true,
        weatherData: {
          maxTemperature:             action["DLY-TMAX-NORMAL"],
          minTemperature:             action["DLY-TMIN-NORMAL"],
          chanceOfPercipitation:      action["DLY-PRCP-PCTALL-GE001HI"],
          chanceOfHeavyPercipitation: action["DLY-PRCP-PCTALL-GE050HI"]
        }
      }
    case 'SET_TRAIL_ADDITIONAL_WEATHER_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasAdditionalWeatherData: true,
        chanceOfSnow:               action["DLY-SNOW-PCTALL-GE001TI"],
        chanceOfHeavySnow:          action["DLY-SNOW-PCTALL-GE030TI"],
        chanceOfSnowPack:           action["DLY-SNWD-PCTALL-GE001WI"],
        chanceOfHeavySnowPack:      action["DLY-SNWD-PCTALL-GE010WI"]
      }
    default: return state
  }
}

const trails = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRAIL':
      if (state.some(t => t.id == action.properties.id)) return state;
      return [...state, trail(undefined, action)]
    case 'SELECT_TRAIL':
      return state.map(t => trail(t, {...action, selectedTrailCount: state.filter(e => e.selected).length + 1}))
    case 'UNSELECT_TRAIL':
      return state.map(t => trail(t, action))
    case 'CLEAR_TRAIL_SELECTED':
    case 'CLEAR_SELECTED':
    case 'ADD_BOUNDARY':
    case 'SELECT_BOUNDARY':
      return state.map(t => trail(t, {...action, type: 'CLEAR_TRAIL_SELECTED'}))
    case 'SET_TRAIL_DATA':
      return state.map(t => trail(t, action))
    case 'SET_TRAIL_SATELLITE_IMAGE':
      return state.map(t => trail(t, action))
    case 'SET_TRAIL_WEATHER_DATA':
      return state.map(t => trail(t, action))
    case 'SET_TRAIL_ADDITIONAL_WEATHER_DATA':
      return state.map(t => trail(t, action))
    default: return state
  }
}

const boundaries = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BOUNDARY':
      if (state.some(b => b.id == action.id)) return state;
      return [...state.map(b => ({...b, selected: false})), boundary(undefined, action)]
    case 'SET_BOUNDARY_DATA':
      return state.map(b => boundary(b, action))
    case 'SET_BOUNDARY_WEATHER_DATA':
      return state.map(b => boundary(b, action))
    case 'SET_BOUNDARY_SATELLITE_IMAGE':
      return state.map(b => boundary(b, action))
    case 'SET_BOUNDARY_ADDITIONAL_WEATHER_DATA':
      return state.map(b => boundary(b, action))
    case 'SELECT_BOUNDARY':
      return state.map(b => boundary(b, action))
    case 'CLEAR_BOUNDARY_SELECTED':
    case 'CLEAR_SELECTED':
    case 'ADD_TRAIL':
    case 'SELECT_TRAIL':
      return state.map(b => boundary(b, {...action, type: 'CLEAR_BOUNDARY_SELECTED'}))
    default: return state
  }
}

const boundary = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_BOUNDARY':
      return {...state,
        id: action.properties.id,
        name: action.properties.name,
        bounds: action.bounds,
        hasBaseData: true,
        selected: true
      }
    case 'SET_BOUNDARY_DATA':
      if (action.id !== state.id) return state;
      return {...state,
        area: action.area,
        dump: action.dump,
        trailsCount: action.trailsCount,
        trailLengths: action.trailLengths,
        trailTypes: action.trailTypes,
        trails: action.trails,
        hasElevationData: true
      }
    case 'SET_BOUNDARY_SATELLITE_IMAGE':
      if (action.id !== state.id) return state
      return {...state,
        hasSatelliteImage: true,
        satelliteImageUrl: action.url
      }
    case 'SET_BOUNDARY_WEATHER_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasWeatherData: true,
        weatherData: {
          maxTemperature:             action["DLY-TMAX-NORMAL"],
          minTemperature:             action["DLY-TMIN-NORMAL"],
          chanceOfPercipitation:      action["DLY-PRCP-PCTALL-GE001HI"],
          chanceOfHeavyPercipitation: action["DLY-PRCP-PCTALL-GE050HI"]
        }
      }
    case 'SET_BOUNDARY_ADDITIONAL_WEATHER_DATA':
      if (action.id !== state.id) return state
      return { ...state,
        hasAdditionalWeatherData: true,
        chanceOfSnow:               action["DLY-SNOW-PCTALL-GE001TI"],
        chanceOfHeavySnow:          action["DLY-SNOW-PCTALL-GE030TI"],
        chanceOfSnowPack:           action["DLY-SNWD-PCTALL-GE001WI"],
        chanceOfHeavySnowPack:      action["DLY-SNWD-PCTALL-GE010WI"]
      }
    case 'SELECT_BOUNDARY':
      return { ...state, selected: (state.id === action.id)};
    case 'CLEAR_BOUNDARY_SELECTED':
      return { ...state, selected: false }
    default: return state
  }
}

const handles = (state = [], action) => {
  switch (action.type) {
    case 'SELECT_TRAIL':
    case 'SET_TRAIL_DATA':
      return [...state,
        handle(null, {...action,
          type: 'ADD_HANDLE',
          point: action.points[0].coordinates,
          handleId: 0,
          index: 0
        }),
        handle(null, {...action,
          type: 'ADD_HANDLE',
          point: action.points[action.points.length - 1].coordinates,
          handleId: 1,
          index: action.points.length
        })
      ]
    case 'CLEAR_TRAIL_SELECTED':
    case 'CLEAR_SELECTED':
    case 'ADD_BOUNDARY':
    case 'SELECT_BOUNDARY':
      return []
    case 'UNSELECT_TRAIL':
     return state.filter(h => h.trailId !== action.id)
    case 'UPDATE_HANDLE':
      return state.map(h => handle(h, action))
    case 'SET_HANDLE_INDEX':
      return state.map(h => handle(h, action))
    default: return state
  }
}

const handle = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_HANDLE':
      return {
        coordinates: action.point,
        id: action.id + '-' + action.handleId,
        index: action.index,
        trailId: action.id
      }
    case 'UPDATE_HANDLE':
      if (action.id !== state.id) return state;
      return {...state,
        coordinates: action.coordinates
      }
    case 'SET_HANDLE_INDEX':
      if (action.id !== state.id) return state;
      return {...state,
        index: action.index
      }
    default: return state
  }
}

export default combineReducers({
  trails,
  boundaries,
  handles
})
