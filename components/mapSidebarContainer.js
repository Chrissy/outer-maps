import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';

export default connect((state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || {},
    loading: state.trails.some(t => t.selected),
  }
})(MapSidebar);
