import React from 'react'
import {metersToMiles} from '../modules/conversions'

export default class TrailTooltip extends React.Component {
  render() {
    return (
      <span>
        name: {this.props.boundary.name}<br/>
        distance: {metersToMiles(this.props.boundary.area)} Miles
      </span>
    )
  }
};
