import { connect } from 'react-redux';
import Tooltip from './tooltip';

const mapStateToProps = (state) => {
  return {
    name: state.lastHoveredTrail.name,
    source: state.lastHoveredTrail.source,
    x: state.lastHoveredTrail.contactX,
    y: state.lastHoveredTrail.contactY,
    visibility: state.tooltipVisibility
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
