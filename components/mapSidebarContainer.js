import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';

export default connect((state) => {
  return {
    trails: state.trails.filter(t => t.selected) || [],
    firstTrail: state.trails.find(t => t.selected) || null
  }
})(MapSidebar);
