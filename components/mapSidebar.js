import React from 'react';
import cx from 'classnames';
import distanceAndElevation from './distanceAndElevation';
import Terrain from './terrain';
import LoadingSpinner from './loadingSpinner';
import {convertToPercent} from '../modules/NOAA'

import styles from './mapSidebar.css';
import spacing from './spacing.css';

export default class MapSidebar extends React.Component {
  terrainComponent() {
    return <Terrain trail={this.props.firstTrail}/>
  }

  elevationComponent() {
    if (this.props.firstTrail.hasElevationData) return <distanceAndElevation trails={this.props.trails.filter(t => t.hasElevationData)}/>
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
          Chance of percipitation: {convertToPercent(this.props.firstTrail.chanceOfPercipitation)}% <br/>
          Chance of heavy percipitation: {convertToPercent(this.props.firstTrail.chanceOfHeavyPercipitation)}% <br/>
          Chance of snow: {convertToPercent(this.props.firstTrail.chanceOfSnow)}% <br/>
          Chance of heavy snow: {convertToPercent(this.props.firstTrail.chanceOfHeavySnow)}% <br/>
          Chance of snowpack: {convertToPercent(this.props.firstTrail.chanceOfSnowPack)}% <br/>
          Chance of heavy snowpack: {convertToPercent(this.props.firstTrail.chanceOfHeavySnowPack)}% <br/>
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.firstTrail.hasBaseData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
