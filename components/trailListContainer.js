import { connect } from "react-redux";
import TrailList from "./trailList";
import { unselectTrail, setTrailSelectedId } from "../state/actions";

const mapDispatchToProps = dispatch => {
  return {
    unselectTrail: uniqueId => dispatch(unselectTrail(uniqueId)),
    setTrailSelectedId: (...params) => {
      return dispatch(setTrailSelectedId(...params));
    }
  };
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(TrailList);
