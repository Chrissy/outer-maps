import { connect } from 'react-redux';
import Tooltip from './tooltip';

const mapStateToProps = (state) => {
  return {
    trail: state.trails.find(t => t.previewing),
    visibility: state.tooltipVisibility,
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
