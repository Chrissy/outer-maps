import React from 'react';
import cx from 'classnames';
import Elevation from './elevation';
import Terrain from './terrain';
import LoadingSpinner from './loadingSpinner';
import {convertToPercent} from '../modules/NOAA'

import styles from '../styles/mapSidebar.css';
import spacing from '../styles/spacing.css';

export default class MapSidebar extends React.Component {
  terrainComponent() {
    return '';
    return <Terrain trail={this.props.firstTrail}/>
  }

  elevationComponent() {
    if (this.props.firstTrail.hasElevationData) return <Elevation trails={this.props.trails.filter(t => t.hasElevationData)}/>
  }

  percentText(integer) {
    return (typeof(integer) == "number") ? convertToPercent(integer) + "%" : "0%";
  }

  render() {
    return (
      <div className={cx(styles.body, {[styles.active]: this.props.loading})}>
        <div className={cx(styles.content, {[styles.active]: this.props.firstTrail.hasBaseData})}>
          name: {this.props.firstTrail.name}<br/>
          {this.terrainComponent()}
          {this.elevationComponent()}
          Weather almanac for this week: <br/>
          High temperature: {this.props.firstTrail.maxTemperature}° <br/>
          Low Temperature: {this.props.firstTrail.minTemperature}° <br/>
          Chance of percipitation: {this.percentText(this.props.firstTrail.chanceOfPercipitation)} <br/>
          Chance of heavy percipitation: {this.percentText(this.props.firstTrail.chanceOfHeavyPercipitation)} <br/>
          Chance of snow: {this.percentText(this.props.firstTrail.chanceOfSnow)} <br/>
          Chance of heavy snow: {this.percentText(this.props.firstTrail.chanceOfHeavySnow)} <br/>
          Chance of snowpack: {this.percentText(this.props.firstTrail.chanceOfSnowPack)} <br/>
          Chance of heavy snowpack: {this.percentText(this.props.firstTrail.chanceOfHeavySnowPack)} <br/>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.firstTrail.hasBaseData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
