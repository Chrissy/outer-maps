import {swapHoveredTrail, hideTooltio, showTooltip} from './actions'
import { connect } from 'react-redux';
import Map from './map';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (name, source, x, y) => {
      dispatch(swapHoveredTrail(name, source, x, y));
      dispatch(showTooltip());
    },

    onTrailMouseOut: () => {
      dispatch(hideTooltip());
    }
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
