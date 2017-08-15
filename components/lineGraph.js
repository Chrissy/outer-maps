import React from 'react';
import _ from 'underscore';
import styles from '../styles/lineGraph.css';

export default class LineGraph extends React.Component {

  pointsToPathString() {
    var points = this.props.elevations;
    var elevations = points.map(e => e.elevation);
    var distances = points.map(p => p.distanceFromPreviousPoint).reduce((a, p) => a.concat(p + _.last(a) || 0), []);
    var maxElevation = Math.max(...elevations);
    var elevationWindow = maxElevation - Math.min(...elevations);
    var fullDistance = _.last(distances);
    var relativePoints = elevations.map((elevation, i) => [((maxElevation - elevation)/elevationWindow), (distances[i]/fullDistance)]);

    return relativePoints.reduce((a,p,i) => a + `${p[1] * 250},${p[0] * 100} `, "0,100 ") + "250,100";
  }

  render() {
    return (
      <svg className={styles.lineGraph} viewBox="0 0 250 100">
        <polyline points={this.pointsToPathString()} strokeWidth="2" fill="#344632"/>
      </svg>
    )
  }
};
