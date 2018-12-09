import { connect } from "react-redux";
import TrailControl from "./trailControl";

const mapStateToProps = state => {
  const activeTrail = state.trails.find(t => t.selected && t.active);

  return { activeTrail };
};

const mapDispatchToProps = dispatch => {
  return {
    onCutClick: uniqueId => dispatch({ type: "START_TRAIL_CUT", uniqueId }),
    onReverseClick: uniqueId => dispatch({ type: "REVERSE_TRAIL", uniqueId }),
    onBothWaysClick: uniqueId =>
      dispatch({ type: "SET_BOTH_WAYS_ON_ACTIVE_TRAIL", uniqueId }),
    onRemoveClick: uniqueId => dispatch({ type: "UNSELECT_TRAIL", uniqueId })
  };
};

const TrailControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrailControl);

export default TrailControlContainer;
