import React from 'react'

export default class LineGraph extends React.Component {

  pointsToPathString() {
    var points = this.props.points;
    var elevations = points.map(e => e.elevation);
    var distances = points.map(e => e.distance);
    var maxElevation = Math.max(...elevations);
    var elevationWindow = maxElevation - Math.min(...elevations);
    var fullDistance = distances[distances.length - 1];
    var relativePoints = points.map((point) => [((maxElevation - point.elevation)/elevationWindow), (point.distance/fullDistance)]);

    return relativePoints.reduce((a,p,i) => a + `${p[1] * 200},${p[0] * 100} `, "0,100 ") + "200,100";
  }

  render() {
    if (!this.props.points || this.props.points.length == 0) return null;

    return (
      <svg width="200" height="100" viewBox="0 0 200 100" style={{width:'100%', height:'100%'}}>
        <polyline points={this.pointsToPathString()} strokeWidth="2" stroke="black"/>
      </svg>
    )
  }
};
