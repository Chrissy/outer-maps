import { connect } from 'react-redux';
import { setHoveredTrail, addActiveTrail } from './actions'
import Map from './map';

const mapStateToProps = (state) => {
  return {
    lastHoveredTrail: state.lastHoveredTrail,
    activeTrails: state.activeTrails,
    trailsDataUrl: state.trailsDataUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => {
      dispatch(setHoveredTrail(trailID));
      dispatch({type: 'SHOW_TOOLTIP'});
    },

    onTrailMouseOut: () => {
      dispatch({type: 'REMOVE_HOVERED_TRAIL'});
      dispatch({type: 'HIDE_TOOLTIP'});
    },

    onTrailClick: (trailID) => {
      dispatch(addActiveTrail(trailID));
    },

    onNonTrailMapClick: () => {
      dispatch({type: 'CLEAR_ACTIVE_TRAILS'});
    },

    setTrailsBox: (bounds) => {
      dispatch({type: 'SET_TRAILS_DATA_URL_BOUNDS', bounds});
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
