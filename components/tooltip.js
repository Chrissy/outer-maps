import React from 'react'
import {metersToMiles} from '../modules/conversions'

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
         distance: {metersToMiles(this.props.trail.distance)} Miles
      </div>
    )
  }
};
