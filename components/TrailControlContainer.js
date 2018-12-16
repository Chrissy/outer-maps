import { connect } from "react-redux";
import TrailControl from "./trailControl";
import { setBothWays } from "../state/actions";

const mapStateToProps = state => {
  const activeTrail = state.trails.find(t => t.selected && t.active);
  const activeHandle = state.handles.find(h => h.activelyCutting);

  return { activeTrail, activeHandle };
};

const mapDispatchToProps = dispatch => {
  return {
    onCutClick: uniqueId =>
      dispatch({ type: "PROGRESS_TRAIL_CUT", uniqueId, cuttingStep: 1 }),
    onCutFinish: uniqueId => dispatch({ type: "FINISH_TRAIL_CUT", uniqueId }),
    onCutCancel: uniqueId => dispatch({ type: "CANCEL_TRAIL_CUT", uniqueId }),
    onReverseClick: uniqueId => dispatch({ type: "REVERSE_TRAIL", uniqueId }),
    onBothWaysClick: trail => dispatch(setBothWays(trail.id)),
    onRemoveClick: uniqueId => dispatch({ type: "UNSELECT_TRAIL", uniqueId })
  };
};

const TrailControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrailControl);

export default TrailControlContainer;
