import React from 'react'

export default class Tooltip extends React.Component {

  recordMousePosition(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMousePosition.bind(this));
  }

  render() {
    return (
      <div
      className={'tooltip' + (this.props.visibility ? '' : ' hidden')}
      style={{top: this.y + 5 + 'px', left: this.x + 5 + 'px'}}
      >
        id: {this.props.trailID}<br/>
      </div>
    )
  }
};
