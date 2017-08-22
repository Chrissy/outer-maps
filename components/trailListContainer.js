import {connect} from 'react-redux';
import TrailList from './trailList';
import {unselectTrail} from '../state/actions'

const mapStateToProps = (state) => {
  const sortedTrails = state.trails.filter(t => t.selected).sort((a,b) => a.selectedId - b.selectedId);

  return {
    trails: sortedTrails || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    unselectTrail: (id) => dispatch(unselectTrail(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailList);
