import React from 'react'
import fetch from 'isomorphic-fetch'

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
      className={'tooltip' + (this.props.visibility ? '' : ' hidden')}
      style={{top: this.y + 5 + 'px', left: this.x + 5 + 'px'}}>
         name: {this.props.trail.name}<br/>
         surface: {this.props.trail.surface}<br/>
         id: {this.props.trail.id}<br/>
         elevation gain: {this.props.elevationChanges.elevationGain}<br/>
         elevation loss: {this.props.elevationChanges.elevationLoss}
      </div>
    )
  }
};
