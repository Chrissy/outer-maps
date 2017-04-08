import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';
import {pathsOppose, reversePath} from '../modules/geometryUtils';

export default connect((state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);

  const cumulativeElevations = sortedTrails.reduce((accumulator, trail) => {
    if (accumulator.length == 0) return trail.points;
    const shouldInvertPaths = pathsOppose(accumulator, trail.points);
    return accumulator.concat(shouldInvertPaths ? reversePath(trail.points): trail.points);
  }, []);

  let elevationGain = 0, elevationLoss = 0;

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || {},
    loading: state.trails.some(t => t.selected),
    cumulativeElevations: cumulativeElevations,
    elevationGain: cumulativeElevations.reduce((a, e) => a + e.elevationGain, 0),
    elevationLoss: cumulativeElevations.reduce((a, e) => a + e.elevationLoss, 0),
    distance: sortedTrails.reduce((a, e) => a + e.distance, 0)
  }
})(MapSidebar);
