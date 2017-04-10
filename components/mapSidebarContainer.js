import { connect } from 'react-redux';
import MapSidebar from './mapSidebar';
import distance from '@turf/distance';
import _ from 'underscore';

const reversePoints = (points) => {
  return [...points].reverse().map((point, i) => {
    return {...point,
      distance: (i == 0) ? 0 : points[i - 1].distance,
      elevationGain: point.elevationLoss,
      elevationLoss: point.elevationGain
    };
  });
}

const pointsOppose = (p1, p2) => {
  const d1 = distance(_.last(p1).coordinates, _.first(p2).coordinates);
  const d2 = distance(_.last(p1).coordinates, _.last(p2).coordinates);
  return d1 > d2;
}

const slice = (points, slice1, slice2) => {
  return points.slice(Math.min(slice1.index, slice2.index), Math.max(slice1.index, slice2.index));
}

export default connect((state) => {
  const sortedTrails = state.trails.filter(t => t.selected && t.hasBaseData).sort((a,b) => a.selectedId - b.selectedId);

  const cumulativeElevations = sortedTrails.reduce((accumulator, trail) => {
    const points = (trail.handles) ? slice(trail.points, trail.handles[0], trail.handles[1]) : trail.points;
    if (accumulator.length == 0) return points;
    const shouldInvertPaths = pointsOppose(accumulator, points);
    return accumulator.concat(shouldInvertPaths ? reversePoints(points) : points);
  }, []);

  let elevationGain = 0, elevationLoss = 0;

  return {
    trails: sortedTrails || [],
    firstTrail: sortedTrails[0] || {},
    loading: state.trails.some(t => t.selected),
    cumulativeElevations: cumulativeElevations,
    elevationGain: cumulativeElevations.reduce((a, e) => a + e.elevationGain, 0),
    elevationLoss: cumulativeElevations.reduce((a, e) => a + e.elevationLoss, 0),
    distance: cumulativeElevations.reduce((a, e) => a + e.distanceFromPreviousPoint, 0)
  }
})(MapSidebar);
