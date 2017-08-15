import React from 'react';
import LineGraph from './lineGraph';
import DifficultyChart from './difficultyChart';
import {metersToFeet, metersToMiles} from '../modules/conversions';

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

  miles() {
    return metersToMiles(this.distance())
  }

  score() {
    return Math.min(100, parseInt((metersToFeet(this.elevationGain()) / 100) + (this.miles() / 14 * 50)));
  }

  render() {
    return (
      <div>
        <DifficultyChart score={this.score()}/>
        distance: {this.miles()} Miles<br/>
        elevation gain: {metersToFeet(this.elevationGain())} Feet<br/>
        elevation loss: {metersToFeet(this.elevationLoss())} Feet<br/>
        <LineGraph elevations={this.props.elevations}/>
      </div>
    )
  }

}
