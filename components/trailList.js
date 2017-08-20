import React from 'react'

export default class TrailList extends React.Component {
  render() {
    return (
      <div>{this.props.trails.map(t => t.name).join(" ")}</div>
    )
  }
};
