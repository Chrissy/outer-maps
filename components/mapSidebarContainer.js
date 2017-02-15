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

  let elevationGain = 0, elevationLoss = 0;

  cumulativeElevations.forEach((point, i) => {
    if (!cumulativeElevations[i + 1]) return;
    let value = point.elevation - cumulativeElevations[i + 1].elevation;

    if (value < 0) elevationGain += Math.abs(value);
    if (value > 0) elevationLoss += value;
  })

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || null,
    cumulativeElevations: cumulativeElevations,
    elevationGain: elevationGain,
    elevationLoss: elevationLoss
  }
})(MapSidebar);
