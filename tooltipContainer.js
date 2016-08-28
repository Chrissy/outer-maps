import { connect } from 'react-redux';
import Tooltip from './tooltip';

const mapStateToProps = (state) => {
  return {
    trail: state.lastHoveredTrail,
    visibility: state.tooltipVisibility,
    elevationChanges: state.activeTrailsElevationChanges
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
