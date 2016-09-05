import { connect } from 'react-redux';
import { previewTrail, selectTrail } from './actions'
import Map from './map';

const mapStateToProps = (state) => {
  return {
    selectedTrails: state.trails.filter(trail => trail.selected),
    previewTrails: state.trails.filter(trail => trail.previewing),
    trailsDataUrl: state.trailsDataUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => dispatch(previewTrail(trailID)),
    onTrailMouseOut: () => dispatch({type: 'CLEAR_PREVIEWING'}),
    onTrailClick: (trailID) => dispatch(selectTrail(trailID)),
    onNonTrailMapClick: () => dispatch({type: 'CLEAR_SELECTED'}),
    setTrailsBox: (bounds) => dispatch({type: 'SET_TRAILS_DATA_URL_BOUNDS', bounds})
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
