import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';
import {pathsOppose, reversePath} from '../modules/geometryUtils';

export default connect((state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasElevationData).sort((a,b) => a.selectedId - b.selectedId);

  const cumulativeElevations = state.trails.filter(t => t.hasElevationData).reduce((accumulator, trail) => {
    if (accumulator.length == 0) return trail.points;
    const shouldInvertPaths = pathsOppose(accumulator, trail.points);
    return accumulator.concat(shouldInvertPaths ? reversePath(trail.points): trail.points);
  }, []);

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || null,
    cumulativeElevations: cumulativeElevations
  }
})(MapSidebar);
