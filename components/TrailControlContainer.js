import { connect } from "react-redux";
import TrailControl from "./trailControl";

const mapStateToProps = state => {
  const activeTrail = state.trails.find(t => t.selected && t.active);

  return { activeTrail };
};

const mapDispatchToProps = dispatch => {
  return {
    onCutClick: () => dispatch({ type: "START_TRAIL_CUT" }),
    onFlipClick: () => dispatch({ type: "FLIP_ACTIVE_TRAIL" }),
    onBothWaysClick: () => dispatch({ type: "SET_BOTH_WAYS_ON_ACTIVE_TRAIL" }),
    onRemoveClick: id => dispatch({ type: "REMOVE_TRAIL", id })
  };
};

const TrailControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrailControl);

export default TrailControlContainer;
