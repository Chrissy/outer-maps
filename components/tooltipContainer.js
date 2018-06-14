import { connect } from "react-redux";
import Tooltip from "./tooltip";

export default connect(state => {
  return {
    trail: state.trails.find(t => t.previewing),
    boundary: state.boundaries.find(b => b.previewing)
  };
})(Tooltip);
