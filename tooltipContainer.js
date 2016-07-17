import { connect } from 'react-redux';
import { swapHoveredTrail } from './actions';
import Tooltip from './tooltip';

const mapStateToProps = (store) => {
  return {
    name: store.lastHoveredTrail.name,
    source: store.lastHoveredTrail.source,
    x: store.lastHoveredTrail.contactX,
    y: store.lastHoveredTrail.contactY
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
