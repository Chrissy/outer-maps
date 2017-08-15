import React from 'react';
import _ from 'underscore';
import styles from '../styles/lineGraph.css';
import {metersToMiles} from '../modules/conversions'

export default class LineGraph extends React.Component {

  distances() {
    var points = this.props.elevations;
    return points.map(p => p.distanceFromPreviousPoint).reduce((a, p) => a.concat(p + _.last(a) || 0), []);
  }

  pointsToPathString() {
    const elevations = this.props.elevations.map(e => e.elevation);
    const maxElevation = Math.max(...elevations);
    const elevationWindow = maxElevation - Math.min(...elevations);
    const distances = this.distances();
    const fullDistance = _.last(distances);
    const relativePoints = elevations.map((elevation, i) => [((maxElevation - elevation)/elevationWindow), (distances[i]/fullDistance)]);

    return relativePoints.reduce((a,p,i) => a + `${p[1] * 250},${p[0] * 100} `, "0,100 ") + "250,100";
  }

  mileMarkers(){
    const miles = metersToMiles(_.last(this.distances()));
    const iterations = Math.ceil(miles);
    const width = parseInt(250 / miles) + ((250 % miles) / miles);
    const leftOver = width * iterations - 250;
    let markers = [];
    for (let step = 0; step < iterations; step++) {
      markers.push(<rect
        x={width * step}
        width={(step == iterations - 1) ? width - leftOver : width}
        height={100}
        key={step}
        fill={(step % 2 !== 0) ? "transparent" : "#EAEAEA"}
      />);
    }
    return markers;
  }

  render() {
    return (
      <svg className={styles.lineGraph} viewBox="0 0 250 100" overflow="hidden">
        <g>{this.mileMarkers()}</g>
        <polyline points={this.pointsToPathString()} strokeWidth="2" fill="#344632"/>
      </svg>
    )
  }
};
