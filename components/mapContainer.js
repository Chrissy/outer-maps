import { connect } from 'react-redux';
import { previewTrail, selectTrail } from '../state/actions'
import Map from '../components/map';

const mapStateToProps = (state) => {
  return {
    selectedTrails: state.trails.filter(trail => trail.selected),
    previewTrails: state.trails.filter(trail => trail.previewing),
    viewBox: state.viewBox
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => dispatch(previewTrail(trailID)),
    onTrailMouseOut: () => dispatch({type: 'CLEAR_PREVIEWING'}),
    onTrailClick: (trailID) => dispatch(selectTrail(trailID)),
    onNonTrailMapClick: () => dispatch({type: 'CLEAR_SELECTED'}),
    setTrailsBox: (bounds) => dispatch({type: 'SET_VIEWBOX', bounds})
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
