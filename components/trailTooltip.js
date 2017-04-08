import React from 'react'
import {metersToMiles, convertToTitleCase} from '../modules/conversions'

export default class TrailTooltip extends React.Component {
  render() {
    const trailName = this.props.trail.name;

    return (
      <span>
        name: {convertToTitleCase(trailName == 'null' ? 'unknown' : trailName)}<br/>
        distance: {metersToMiles(this.props.trail.distance)} Miles<br/>
        id: {this.props.trail.id}
      </span>
    )
  }
};
