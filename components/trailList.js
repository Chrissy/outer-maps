import React from 'react'
import {metersToMiles} from '../modules/conversions';


export default class TrailList extends React.Component {
  listElement(trail) {
    return <div>{trail.name} | {metersToMiles(trail.distance)}</div>
  }

  render() {
    return (
      <div>{this.props.trails.map(t => this.listElement(t))}</div>
    )
  }
};
