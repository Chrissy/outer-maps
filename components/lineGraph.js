import React from 'react';
import cx from 'classnames';
import styles from '../styles/lineGraph.css';
import {metersToMiles} from '../modules/conversions'
import label from '../styles/label.css';
import spacing from '../styles/spacing.css';

const width = 275;
const height = 100;

const LineGraph = ({elevations}) => {

  const getDistances = () => {
    return elevations.map(p => p.distanceFromPreviousPoint).reduce((a, p) => a.concat(p + a[a.length - 1] || 0), []);
  }

  const pointsToPathString = () => {
    const es = elevations.map(e => e.elevation);
    const maxElevation = Math.max(...es);
    const elevationWindow = maxElevation - Math.min(...es);
    const distances = getDistances();
    const fullDistance = distances[distances.length - 1];
    const relativePoints = es.map((elevation, i) => [((maxElevation - elevation)/elevationWindow), (distances[i]/fullDistance)]);

    return relativePoints.reduce((a,p,i) => a + `${p[1] * width},${p[0] * height} `, `0,${height} `) + `${width},${height}`;
  }

  const textMarker = ({stepWidth, step, iterations, every}) => {
    if (step % every !== 0) return;
    return <text x={stepWidth * step + 2} y={7} fill="#D5D5D5" fontSize="7px">{step + 1}</text>
  }

  const mileMarker = ({stepWidth, step, iterations, leftOver}) => {
    let every = 1;
    if (iterations > 7) every = 2;
    if (iterations > 20) every = 5;
    if (iterations > 50) every = 10;
    return <g key={step}>
      <rect
        x={stepWidth * step}
        width={(step == iterations - 1) ? stepWidth - leftOver : stepWidth}
        height={height}
        fill={(Math.floor(step / every) % 2 !== 0) ? "transparent" : "#EAEAEA"}
      />
      {textMarker({stepWidth, step, iterations, every})}
    </g>
  }

  const mileMarkers = () => {
    const distances = getDistances();
    const miles = metersToMiles(distances[distances.length - 1]);
    const iterations = Math.ceil(miles);
    const stepWidth = parseInt(width / miles) + ((width % miles) / miles);
    const leftOver = stepWidth * iterations - width;
    let markers = [];
    for (let step = 0; step < iterations; step++) {
      markers.push(mileMarker({stepWidth, step, iterations, leftOver}));
    }
    return markers;
  }

  const viewBox = () => `0 0 ${width} ${height}`;

  return (
    <div className={spacing.marginTop}>
      <div className={label.label}>Altitude Change</div>
      <svg viewBox={viewBox()} overflow="hidden" className={styles.lineGraph}>
        <g>{mileMarkers()}</g>
        <polyline points={pointsToPathString()} fill="#344632"/>
      </svg>
    </div>
  )
};

export default LineGraph;
