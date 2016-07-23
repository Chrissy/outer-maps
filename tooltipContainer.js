import { connect } from 'react-redux';
import Tooltip from './tooltip';

const mapStateToProps = (state) => {
  return {
    name: state.name,
    source: state.source,
    x: state.contactX,
    y: state.contactY
  }
};

const TooltipContainer = connect(mapStateToProps)(Tooltip);

export default TooltipContainer;
