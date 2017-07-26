import React from 'react';
import LineGraph from './lineGraph';

export default class ElevationTotals extends React.Component {
  elevationGain() {
    return this.props.elevations.reduce((a, e) => a + e.elevationGain, 0);
  }

  elevationLoss() {
    return this.props.elevations.reduce((a, e) => a + e.elevationLoss, 0);
  }

  distance() {
    return this.props.elevations.reduce((a, e) => a + e.distanceFromPreviousPoint, 0);
  }

  render() {
    return (
      <div>
        distance: {metersToMiles(this.distance())}<br/>
        elevation gain: {metersToFeet(this.elevationGain())} Feet<br/>
        elevation loss: {metersToFeet(this.elevationLoss())} Feet<br/>
        <LineGraph elevations={this.props.elevations}/>
      </div>
    )
  }

}
