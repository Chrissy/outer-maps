import Geolib from 'geolib';
import _ from 'underscore';

export const reversePath = function(points) {
  return [...points].reverse().map((point, i) => {
    return {...point, distance: (i == 0) ? 0 : points[i - 1].distance};
  });
}

export const pathsOppose = function(pointSet1, pointSet2) {
  const distanceToFirstPoint = Geolib.getDistance(_.last(pointSet1).coordinates, _.first(pointSet2).coordinates);
  const distanceToLastPoint = Geolib.getDistance(_.last(pointSet1).coordinates, _.last(pointSet2).coordinates);

  return distanceToFirstPoint > distanceToLastPoint;
}
