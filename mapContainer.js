import { connect } from 'react-redux';
import { setHoveredTrail } from './actions'
import Map from './map';

const mapStateToProps = (state) => {
  return {
    activeTrails: state.lastHoveredTrail
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => {
      dispatch(setHoveredTrail(trailID));
      dispatch({type: 'SHOW_TOOLTIP'});
    },

    onTrailMouseOut: () => {
      dispatch({type: 'HIDE_TOOLTIP'});
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
