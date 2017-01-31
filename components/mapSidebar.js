import React from 'react';
import LineGraph from './lineGraph';
import {metersToFeet} from '../modules/conversions';

export default class MapSidebar extends React.Component {

  render() {
    return (
      <div style={{
        position: 'absolute',
        height: 'calc(100% - 2em)',
        width: '25vw',
        minWidth: '300px',
        margin: '1em',
        background: '#fefefe',
        boxSizing: 'border-box'
      }}>
        surface: {this.props.trail.surface}<br/>
        elevation gain: {metersToFeet(this.props.trail.elevationGain)} Feet<br/>
        elevation loss: {metersToFeet(this.props.trail.elevationLoss)} Feet<br/>
        <LineGraph points={this.props.trail.elevations}/>
      </div>
    )
  }
};
