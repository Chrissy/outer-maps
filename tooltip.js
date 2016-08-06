import React from 'react'

export default class Tooltip extends React.Component {
  render() {
    return (
      <div
      className={'tooltip' + (this.props.visibility ? ' hidden' : '')}
      style={{top: this.props.y + 5 + 'px', left: this.props.x + 5 + 'px'}}>
        name: {this.props.name}<br/>
        source: {this.props.source}<br/>
        visibility: {this.props.visibility}
      </div>
    )
  }
};
