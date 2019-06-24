import { connect } from "react-redux";
import Map from "../components/map";
import { selectTrail, selectBoundary, clearSelected } from "../state/actions";

const mapStateToProps = (state, props) => {
  return {
    trails: state.trails,
    boundary: state.boundaries.find(boundary => boundary.selected),
    handles: state.handles,
    ...props
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTrailClick: trail => dispatch(selectTrail(trail)),
    onBoundaryClick: boundary => dispatch(selectBoundary(boundary)),
    onNonFeatureClick: () => dispatch(clearSelected()),
    updateHandle: (id, coordinates) =>
      dispatch({ type: "UPDATE_HANDLE", id, coordinates }),
    setHandleIndex: (id, index, cuttingStep, uniqueId) => {
      dispatch({ type: "SET_HANDLE_INDEX", id, index });
      if (cuttingStep)
        dispatch({
          type: "PROGRESS_TRAIL_CUT",
          id,
          cuttingStep: cuttingStep + 1,
          uniqueId
        });
    },
    progressTrailCut: id => dispatch({ type: "PROGRESS_TRAIL_CUT", id })
  };
};

const mapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default mapContainer;
