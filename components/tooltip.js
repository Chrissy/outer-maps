import React from 'react'
import TrailTooltip from './trailTooltip'
import BoundaryTooltip from './boundaryTooltip'

export default class Tooltip extends React.Component {

  recordMousePosition(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMousePosition.bind(this));
  }

  tooltipContent() {
    if (this.props.trail) return <TrailTooltip trail={this.props.trail} />
    if (this.props.boundary) return <BoundaryTooltip boundary={this.props.boundary} />
  }

  render() {
    return (
      <div
      className={'tooltip' + (this.props.trail || this.props.boundary ? '' : ' hidden')}
      style={{top: this.y + 5 + 'px', left: this.x + 5 + 'px'}}>
        {this.tooltipContent()}
      </div>
    )
  }
};
