import { connect } from "react-redux";
import TrailList from "./trailList";
import { unselectTrail } from "../state/actions";

const mapDispatchToProps = dispatch => {
  return {
    unselectTrail: uniqueId => dispatch(unselectTrail(uniqueId))
  };
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(TrailList);
