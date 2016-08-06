import { connect } from 'react-redux';
import Map from './map';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID, contactX, contactY) => {
      dispatch({type: 'SWAP_HOVERED_TRAIL', trailID, contactX, contactY});
      dispatch({type: 'SHOW_TOOLTIP'});
    },

    onTrailMouseOut: () => {
      dispatch({type: 'HIDE_TOOLTIP'});
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
