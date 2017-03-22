import React from 'react'
import {metersToMiles, convertToTitleCase} from '../modules/conversions'

export default class TrailTooltip extends React.Component {
  render() {
    return (
      <span>
        name: {convertToTitleCase(this.props.trail.name)}<br/>
        distance: {metersToMiles(this.props.trail.distance)} Miles<br/>
        id: {this.props.trail.id}
      </span>
    )
  }
};
