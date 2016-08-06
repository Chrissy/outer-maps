import { connect } from 'react-redux';
import { fetchTrail } from './actions'
import Map from './map';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => {
      dispatch(fetchTrail(trailID));
      dispatch({type: 'SHOW_TOOLTIP'});
    },

    onTrailMouseOut: () => {
      dispatch({type: 'HIDE_TOOLTIP'});
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
