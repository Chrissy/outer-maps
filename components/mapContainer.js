import { connect } from 'react-redux';
import { previewTrail, previewBoundary, selectTrail, selectBoundary, addSource, refreshSourcesForZoomLevel, clearPreviewing, clearSelected } from '../state/actions'
import Map from '../components/map';

const mapStateToProps = (state) => {
  return {
    selectedTrails: state.trails.filter(trail => trail.selected),
    previewTrails: state.trails.filter(trail => trail.previewing),
    selectedBoundary: state.boundaries.filter(boundary => boundary.selected),
    previewBoundary: state.boundaries.filter(boundary => boundary.previewing),
    sources: state.sources
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFeatureMouseIn: (id, layer) => dispatch((layer == "trails") ? previewTrail(id) : previewBoundary(id)),
    onFeatureMouseOut: () => dispatch(clearPreviewing()),
    onFeatureClick: (id, layer) => dispatch((layer == "trails") ? selectTrail(id) : selectBoundary(id)),
    onNonFeatureClick: () => dispatch(clearSelected()),
    updateView: (bounds, zoom) => dispatch({type: 'UPDATE_VIEW', bounds, zoom}),
    addSource: (source) => dispatch(addSource(source))
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
