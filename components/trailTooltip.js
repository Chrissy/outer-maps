import React from 'react'
import {metersToMiles} from '../modules/conversions'

export default class TrailTooltip extends React.Component {
  render() {
    return (
      <span>
        name: {this.props.trail.name}<br/>
        distance: {metersToMiles(this.props.trail.distance)} Miles
        id: {this.props.trail.id}
      </span>
    )
  }
};
