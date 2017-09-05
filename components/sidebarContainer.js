import {connect} from 'react-redux';
import Sidebar from './sidebar';

const mapStateToProps = (state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);
  const boundary = state.boundaries.find(t => t.selected);

  return {
    trails: sortedTrails,
    boundary: boundary
  }
}

export default connect(mapStateToProps)(Sidebar);
