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

  textMarker({width, step, iterations, every}) {
    if (step % every !== 0) return;
    return <text x={width * step + 2} y={7} fill="#D5D5D5" fontSize="7px">{step + 1}</text>
  }

  mileMarker({width, step, iterations, leftOver}) {
    let every = 1;
    if (iterations > 7) every = 2;
    if (iterations > 20) every = 5;
    if (iterations > 50) every = 10;
    return <g key={step}>
      <rect
        x={width * step}
        width={(step == iterations - 1) ? width - leftOver : width}
        height={100}
        fill={(Math.floor(step / every) % 2 !== 0) ? "transparent" : "#EAEAEA"}
      />
      {this.textMarker({width, step, iterations, every})}
    </g>
  }

  mileMarkers(){
    const miles = metersToMiles(_.last(this.distances()));
    const iterations = Math.ceil(miles);
    const width = parseInt(250 / miles) + ((250 % miles) / miles);
    const leftOver = width * iterations - 250;
    let markers = [];
    for (let step = 0; step < iterations; step++) {
      markers.push(this.mileMarker({width, step, iterations, leftOver}));
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
