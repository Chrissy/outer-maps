import {connect} from 'react-redux';
import Sidebar from './sidebar';
import {getAdditionalWeatherData} from '../state/actions'

const mapStateToProps = (state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || {},
    loading: state.trails.some(t => t.selected)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAdditionalWeatherData: (trail) => dispatch(getAdditionalWeatherData(trail))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
