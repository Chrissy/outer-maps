import React from 'react';
import _ from 'underscore';
import distance from '@turf/distance';
import ElevationTotals from './elevationTotals';
import sliceElevationsWithHandles from '../modules/sliceElevationsWithHandles';

export default class Elevation extends React.Component {

  reversePoints(points) {
    return [...points].reverse().map((point, i) => {
      return {...point,
        distance: (i == 0) ? 0 : points[i - 1].distance,
        elevationGain: point.elevationLoss,
        elevationLoss: point.elevationGain
      };
    });
  }

  pointsOppose(p1, p2) {
    const d1 = distance(_.last(p1).coordinates, _.first(p2).coordinates);
    const d2 = distance(_.last(p1).coordinates, _.last(p2).coordinates);
    return d1 > d2;
  }

  cumulativeElevations() {
    return this.props.trails.reduce((accumulator, trail) => {
      const points = sliceElevationsWithHandles(trail).points;
      if (accumulator.length == 0) return points;
      const shouldInvertPaths = this.pointsOppose(accumulator, points);
      return accumulator.concat(shouldInvertPaths ? this.reversePoints(points) : points);
    }, []);
  }

  render() {
    return (
      <div>
        <ElevationTotals elevations={this.cumulativeElevations()}/>
      </div>
    )
  }
};
