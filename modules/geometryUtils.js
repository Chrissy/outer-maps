import distance from '@turf/distance';
import _ from 'underscore';

export const reversePath = function(points) {
  return [...points].reverse().map((point, i) => {
    return {...point,
      distance: (i == 0) ? 0 : points[i - 1].distance,
      elevationGain: point.elevationLoss,
      elevationLoss: point.elevationGain
    };
  });
}

export const pathsOppose = function(p1, p2) {
  return distance(_.last(p1).coordinates, _.first(p2).coordinates) > distance(_.last(p1).coordinates, _.last(p2).coordinates);
}
