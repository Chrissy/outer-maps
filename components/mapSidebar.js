import React from 'react';
import cx from 'classnames';
import Geolib from 'geolib';
import LineGraph from './lineGraph';
import LoadingSpinner from './loadingSpinner';
import _ from 'underscore';
import {metersToFeet, metersToMiles} from '../modules/conversions';
import {convertToPercent} from '../modules/NOAA'

import styles from './mapSidebar.css';
import spacing from './spacing.css';

export default class MapSidebar extends React.Component {

  cumulativeElevations() {
    return this.props.trails.reduce(function(accumulator, trail) {
      let elevations = trail.elevations;
      if (!elevations || elevations.length == 0) return accumulator;
      if (accumulator.length > 0) {
        const distanceToFirstPoint = Geolib.getDistance(_.last(accumulator)[1], _.first(elevations)[1]);
        const distanceToLastPoint = Geolib.getDistance(_.last(accumulator)[1], _.last(elevations)[1]);
        if (distanceToFirstPoint > distanceToLastPoint) elevations.reverse();
        return accumulator.concat(this.mapElevationsToDistances(elevations).map(t => [t[0], t[1], t[2] + _.last(accumulator)[2]]));
      } else {
        return accumulator.concat(this.mapElevationsToDistances(elevations));
      }
    }.bind(this), []);
  }

  mapElevationsToDistances(elevations){
    let distance = 0;
    return elevations.map((element, index) => {
      distance = (index == 0) ? 0 : Geolib.getDistance(element[1], elevations[index - 1][1]) + distance;
      return [element[0], element[1], distance];
    });
  }

  compoundTrailsAttribute(attribute) {
    return this.props.trails.reduce((accumulator, trail) => accumulator += trail[attribute], 0);
  }

  render() {

    if (!this.props.firstTrail) return null;

    return (
      <div className={cx(styles.body, {[styles.active]: this.props.firstTrail.selected})}>
        <div className={cx(styles.content, {[styles.active]: this.props.firstTrail.hasElevationData})}>
          length: {metersToMiles(this.compoundTrailsAttribute("distance"))}<br/>
          elevation gain: {metersToFeet(this.compoundTrailsAttribute("elevationGain"))} Feet<br/>
          elevation loss: {metersToFeet(this.compoundTrailsAttribute("elevationLoss"))} Feet<br/>
          <div className={spacing.top_margin}>
            <LineGraph points={this.cumulativeElevations()}/>
          </div>
          Weather almanac for this week: <br/>
          High temperature: {this.props.firstTrail.maxTemperature}° <br/>
          Low Temperature: {this.props.firstTrail.minTemperature}° <br/>
          Chance of percipitation: {convertToPercent(this.props.firstTrail.chanceOfPercipitation)}% <br/>
          Chance of heavy percipitation: {convertToPercent(this.props.firstTrail.chanceOfHeavyPercipitation)}% <br/>
          Chance of snow: {convertToPercent(this.props.firstTrail.chanceOfSnow)}% <br/>
          Chance of heavy snow: {convertToPercent(this.props.firstTrail.chanceOfHeavySnow)}% <br/>
          Chance of snowpack: {convertToPercent(this.props.firstTrail.chanceOfSnowPack)}% <br/>
          Chance of heavy snowpack: {convertToPercent(this.props.firstTrail.chanceOfHeavySnowPack)}% <br/>
          surface: {this.props.firstTrail.surface || 'unknown'}<br/>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.firstTrail.hasElevationData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
