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
          Weather almanac for this week:
          High temperature: {this.props.trail.maxTemperature}° <br/>
          Low Temperature: {this.props.trail.minTemperature}° <br/>
          Chance of percipitation: {this.props.trail.chanceOfPercipitation}% <br/>
          Chance of heavy percipitation: {this.props.trail.chanceOfHeavyPercipitation}% <br/>
          Chance of snow: {this.props.trail.chanceOfSnow}% <br/>
          Chance of heavy snow: {this.props.trail.chanceOfHeavySnow}% <br/>
          Chance of snowpack: {this.props.trail.chanceOfSnowPack}% <br/>
          Chance of heavy snowpack: {this.props.trail.chanceOfHeavySnowPack}% <br/>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.trail.hasElevationData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
