import { connect } from 'react-redux';
import { previewTrail, selectTrail, addSource, refreshSourcesForZoomLevel } from '../state/actions'
import Map from '../components/map';

const mapStateToProps = (state) => {
  return {
    selectedTrails: state.trails.filter(trail => trail.selected),
    previewTrails: state.trails.filter(trail => trail.previewing),
    sources: state.sources
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailMouseIn: (trailID) => dispatch(previewTrail(trailID)),
    onTrailMouseOut: () => dispatch({type: 'CLEAR_PREVIEWING'}),
    onTrailClick: (trailID) => dispatch(selectTrail(trailID)),
    onNonTrailMapClick: () => dispatch({type: 'CLEAR_SELECTED'}),
    updateView: (bounds, zoom) => dispatch({type: 'UPDATE_VIEW', bounds, zoom}),
    addSource: (source) => dispatch(addSource(source))
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
