import {connect} from "react-redux";
import TrailList from "./trailList";
import {unselectTrail} from "../state/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    unselectTrail: (id) => dispatch(unselectTrail(id))
  };
};

export default connect(() => ({}), mapDispatchToProps)(TrailList);
