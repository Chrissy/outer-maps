import React from 'react';
import cx from "classnames";
import LineGraph from './lineGraph';
import LoadingSpinner from './loadingSpinner';
import {metersToFeet} from '../modules/conversions';

import styles from './mapSidebar.css';
import spacing from './spacing.css';

export default class MapSidebar extends React.Component {

  render() {
    return (
      <div className={cx(styles.body, {[styles.active]: this.props.trail.selected})}>
        <div className={cx(styles.content, {[styles.active]: this.props.trail.hasElevationData})}>
          surface: {this.props.trail.surface || 'unknown'}<br/>
          elevation gain: {metersToFeet(this.props.trail.elevationGain)} Feet<br/>
          elevation loss: {metersToFeet(this.props.trail.elevationLoss)} Feet<br/>
          <div className={spacing.top_margin}>
            <LineGraph points={this.props.trail.elevations}/>
          </div>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.trail.hasElevationData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
