import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';

const mapStateToProps = (state) => {
  return { trail: state.trails.find(t => t.previewing) || {} }
};

const mapSidebarContainer = connect(mapStateToProps)(MapSidebar);

export default mapSidebarContainer;
