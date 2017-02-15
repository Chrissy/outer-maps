import React from 'react';
import _ from 'underscore';

export default class LineGraph extends React.Component {

  pointsToPathString() {
    var points = this.props.points;
    var elevations = points.map(e => e.elevation);
    var distances = points.map(p => p.distanceFromPreviousPoint).reduce((a, p) => a.concat(p + _.last(a) || 0), []);
    var maxElevation = Math.max(...elevations);
    var elevationWindow = maxElevation - Math.min(...elevations);
    var fullDistance = _.last(distances);
    var relativePoints = elevations.map((elevation, i) => [((maxElevation - elevation)/elevationWindow), (distances[i]/fullDistance)]);

    return relativePoints.reduce((a,p,i) => a + `${p[1] * 200},${p[0] * 100} `, "0,100 ") + "200,100";
  }

  render() {
    return (
      <svg width="200" height="100" viewBox="0 0 200 100" style={{width:'100%', height:'100%'}}>
        <polyline points={this.pointsToPathString()} strokeWidth="2" stroke="black"/>
      </svg>
    )
  }
};
