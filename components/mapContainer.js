import { connect } from 'react-redux';
import Map from '../components/map';
import {
  previewTrail,
  previewBoundary,
  selectTrail,
  selectBoundary,
  clearPreviewing,
  clearSelected,
  getTrails,
  getBoundaries
} from '../state/actions'

const mapStateToProps = (state) => {
  return {
    selectedTrails: state.trails.filter(trail => trail.selected),
    previewTrails: state.trails.filter(trail => trail.previewing),
    activeTrails: [...state.trails.filter(trail => trail.previewing), ...state.trails.filter(trail => trail.selected)],
    trails: state.trails,
    boundaries: state.boundaries,
    selectedBoundary: state.boundaries.find(boundary => boundary.selected) || {},
    previewBoundary: state.boundaries.find(boundary => boundary.previewing) || {},
    activeBoundaries: [...state.boundaries.filter(boundary => boundary.selected), ...state.boundaries.filter(boundary => boundary.previewing)],
    handles: state.trails.reduce((a, t) => (t.handles) ? a.concat(t.handles) : a, []),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFeatureMouseIn: (feature, layer) => dispatch((layer == "trails") ? previewTrail(feature) : previewBoundary(feature)),
    onFeatureMouseOut: () => dispatch(clearPreviewing()),
    onTrailClick: (trail) => dispatch(selectTrail(trail)),
    onBoundaryClick: (id) => dispatch(selectBoundary(id)),
    onNonFeatureClick: () => dispatch(clearSelected()),
    getTrails: (viewBox) => dispatch(getTrails(viewBox)),
    getBoundaries: (viewBox) => dispatch(getBoundaries(viewBox)),
    updateHandle: (id, coordinates) => dispatch({type: 'UPDATE_HANDLE', id, coordinates})
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
