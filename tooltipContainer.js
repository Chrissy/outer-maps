import { connect } from 'react-redux';
import Tooltip from './tooltip';

const mapStateToProps = (state) => {
  return {
    trailID: state.lastHoveredTrail.trailID,
    x: state.lastHoveredTrail.contactX,
    y: state.lastHoveredTrail.contactY,
    visibility: state.tooltipVisibility
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
