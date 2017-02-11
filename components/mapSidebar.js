import React from 'react';
import cx from "classnames";
import LineGraph from './lineGraph';
import LoadingSpinner from './loadingSpinner';
import _ from 'underscore';
import {metersToFeet, metersToMiles} from '../modules/conversions';

import styles from './mapSidebar.css';
import spacing from './spacing.css';

export default class MapSidebar extends React.Component {

  cumulativeElevations() {
    return this.props.trails.reduce((accumulator, trail) => {
      let elevations = trail.elevations;
      if (!elevations || elevations.length == 0) return accumulator;
      if (accumulator.length > 0) return accumulator.concat(elevations.map(t => [t[0], t[1] + _.last(accumulator)[1]]));
      return accumulator.concat(elevations);
    }, []);
  }

  cumulativeElevationGain() {
    return this.props.trails.reduce((accumulator, trail) => accumulator += trail.elevationGain, 0);
  }

  cumulativeElevationLoss() {
    return this.props.trails.reduce((accumulator, trail) => accumulator += trail.elevationLoss, 0);
  }

  cumulativeDistance() {
    return this.props.trails.reduce((accumulator, trail) => accumulator += trail.distance, 0);
  }

  render() {

    if (!this.props.firstTrail) return null;

    return (
      <div className={cx(styles.body, {[styles.active]: this.props.firstTrail.selected})}>
        <div className={cx(styles.content, {[styles.active]: this.props.firstTrail.hasElevationData})}>
          length: {metersToMiles(this.cumulativeDistance())}<br/>
          elevation gain: {metersToFeet(this.cumulativeElevationGain())} Feet<br/>
          elevation loss: {metersToFeet(this.cumulativeElevationLoss())} Feet<br/>
          <div className={spacing.top_margin}>
            <LineGraph points={this.cumulativeElevations()}/>
          </div>
          Weather almanac for this week: <br/>
          High temperature: {this.props.firstTrail.maxTemperature}° <br/>
          Low Temperature: {this.props.firstTrail.minTemperature}° <br/>
          Chance of percipitation: {this.props.firstTrail.chanceOfPercipitation}% <br/>
          Chance of heavy percipitation: {this.props.firstTrail.chanceOfHeavyPercipitation}% <br/>
          Chance of snow: {this.props.firstTrail.chanceOfSnow}% <br/>
          Chance of heavy snow: {this.props.firstTrail.chanceOfHeavySnow}% <br/>
          Chance of snowpack: {this.props.firstTrail.chanceOfSnowPack}% <br/>
          Chance of heavy snowpack: {this.props.firstTrail.chanceOfHeavySnowPack}% <br/>
          surface: {this.props.firstTrail.surface || 'unknown'}<br/>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.firstTrail.hasElevationData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
