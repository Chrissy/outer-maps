import { connect } from 'react-redux';
import Map from '../components/map';
import {selectTrail, selectBoundary, clearSelected, getTrails, getBoundaries} from '../state/actions';

const mapStateToProps = (state) => {
  return {
    trails: state.trails,
    boundaries: state.boundaries
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrailClick: (trail) => dispatch(selectTrail(trail)),
    onBoundaryClick: (boundary) => dispatch(selectBoundary(boundary)),
    onNonFeatureClick: () => dispatch(clearSelected()),
    getTrails: (viewBox) => dispatch(getTrails(viewBox)),
    getBoundaries: (viewBox) => dispatch(getBoundaries(viewBox)),
    updateHandle: (id, coordinates) => dispatch({type: 'UPDATE_HANDLE', id, coordinates}),
    setHandleIndex: (id, index) => dispatch({type: 'SET_HANDLE_INDEX', id, index})
  }
};

const mapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default mapContainer;
