import React from 'react';
import _ from 'underscore';
import distance from '@turf/distance';
import LineGraph from './lineGraph';
import {metersToFeet, metersToMiles} from '../modules/conversions';

export default class elevationData extends React.Component {

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

  sliceTrailElevationsWithHandles(trail) {
    if (!trail.handles) return trail;
    const indeces = trail.handles.map(h => h.index).sort((a,b) => a - b);
    return Object.assign({}, trail, {
      points: trail.points.slice(indeces[0], indeces[1])
    });
  }

  cumulativeElevations() {
    return this.props.trails.reduce((accumulator, trail) => {
      const points = this.sliceTrailElevationsWithHandles(trail).points;
      if (accumulator.length == 0) return points;
      const shouldInvertPaths = this.pointsOppose(accumulator, points);
      return accumulator.concat(shouldInvertPaths ? this.reversePoints(points) : points);
    }, []);
  }

  elevationGain() {
    return this.cumulativeElevations().reduce((a, e) => a + e.elevationGain, 0);
  }

  elevationLoss() {
    return this.cumulativeElevations().reduce((a, e) => a + e.elevationLoss, 0);
  }

  distance() {
    return this.cumulativeElevations().reduce((a, e) => a + e.distanceFromPreviousPoint, 0);
  }

  render() {
    return (
      <div>
        distance: {metersToMiles(this.distance())}<br/>
        elevation gain: {metersToFeet(this.elevationGain())} Feet<br/>
        elevation loss: {metersToFeet(this.elevationLoss())} Feet<br/>

        <LineGraph points={this.cumulativeElevations()}/>
      </div>
    )
  }
};
