import React from 'react';
import cx from "classnames";
import LineGraph from './lineGraph';
import LoadingSpinner from './loadingSpinner';
import {metersToFeet} from '../modules/conversions';
import {getDataFromNearestStation} from '../modules/NOAA';
import NOAA from '../modules/NOAA';

import styles from './mapSidebar.css';
import spacing from './spacing.css';

getDataFromNearestStation({
  x: 36.8,
  y: -118.7,
  dataSetID: "NORMAL_DLY",
  dataTypeIDs: [
    "DLY-TMAX-NORMAL",
    "DLY-TMIN-NORMAL",
    "DLY-PRCP-PCTALL-GE001HI",
    "DLY-PRCP-PCTALL-GE050HI",
    "DLY-SNOW-PCTALL-GE001TI",
    "DLY-SNOW-PCTALL-GE030TI",
    "DLY-SNWD-PCTALL-GE001WI",
    "DLY-SNWD-PCTALL-GE010WI"
  ]
}).then(r => console.log(r));

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
