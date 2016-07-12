import React from 'react'

export default class Tooltip extends React.Component {
  render() {
    return (
      <div>
        name: {this.props.name}<br/>
        source: {this.props.source}
      </div>
    )
  }
};
