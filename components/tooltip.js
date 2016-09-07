import React from 'react'
import fetch from 'isomorphic-fetch'
import {metersToFeet, metersToMiles} from '../modules/conversions'

export default class Tooltip extends React.Component {

  recordMousePosition(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMousePosition.bind(this));
  }

  render() {
    if (!this.props.trail) return null;

    return (
      <div
      className={'tooltip' + (this.props.trail ? '' : ' hidden')}
      style={{top: this.y + 5 + 'px', left: this.x + 5 + 'px'}}>
         name: {this.props.trail.name}<br/>
         elevation gain: {metersToFeet(this.props.trail.elevationGain)} Feet<br/>
         elevation loss: {metersToFeet(this.props.trail.elevationLoss)} Feet<br/>
         distance: {metersToMiles(this.props.trail.distance)} Miles<br/>
         surface: {this.props.trail.surface}<br/>
         id: {this.props.trail.id}
      </div>
    )
  }
};
