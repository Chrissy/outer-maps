import { connect } from 'react-redux';
import { setHoveredTrail, addActiveTrail } from './actions'
import Map from './map';

const mapStateToProps = (state) => {
  return {
    lastHoveredTrail: state.lastHoveredTrail,
    activeTrails: state.activeTrails
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
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
