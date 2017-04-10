import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';
import distance from '@turf/distance';
import _ from 'underscore';

export default connect((state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || {},
    loading: state.trails.some(t => t.selected),
  }
})(MapSidebar);
