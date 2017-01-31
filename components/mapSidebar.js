import React from 'react';
import LineGraph from './lineGraph';
import LoadingSpinner from './loadingSpinner';
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
        boxSizing: 'border-box',
        padding: '1em',
        opacity: (this.props.trail.selected) ? '1' : '0',
        transform: `translateX(${(this.props.trail.selected) ? '0' : '-1em'})`,
        transition: '.3s all'
      }}>
        <div style={{
          opacity: (this.props.trail.hasElevationData) ? '1' : '0',
          fontSize: '1.1em',
          lineHeight: '1.5em',
          transition: '.2s all'
        }}>
          surface: {this.props.trail.surface || 'unknown'}<br/>
          elevation gain: {metersToFeet(this.props.trail.elevationGain)} Feet<br/>
          elevation loss: {metersToFeet(this.props.trail.elevationLoss)} Feet<br/>
          <div style={{marginTop: '1em'}}>
            <LineGraph points={this.props.trail.elevations}/>
          </div>
        </div>
        <div style={{
          opacity: (!this.props.trail.hasElevationData) ? '1' : '0',
          transition: '.2s all',
          width: '2em',
          height: '2em',
          left: '50%',
          top: '50%',
          position: 'absolute',
          transform: 'translateX(-50%) translateY(-50%)'
        }}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
