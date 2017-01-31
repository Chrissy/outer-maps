import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';

export default connect((state) => {
  return { trail: state.trails.find(t => t.selected) || {} }
})(MapSidebar);
