import React from 'react';
import LineGraph from './lineGraph';
import DifficultyChart from './difficultyChart';
import Hiker from '../svg/hiker.svg';
import Mountain from '../svg/mountain.svg';
import {metersToFeet, metersToMiles} from '../modules/conversions';
import styles from '../styles/elevationTotals.css';
import cx from 'classnames';
import NumberFormat from 'react-number-format';
import spacing from '../styles/spacing.css';

export default class ElevationTotals extends React.Component {
  elevationGain() {
    return this.props.elevations.reduce((a, e) => a + e.elevationGain, 0);
  }

  elevationLoss() {
    return this.props.elevations.reduce((a, e) => a + e.elevationLoss, 0);
  }

  distance() {
    return this.props.elevations.reduce((a, e) => a + e.distanceFromPreviousPoint, 0);
  }

  miles() {
    return metersToMiles(this.distance())
  }

  score() {
    return Math.min(100, parseInt((metersToFeet(this.elevationGain()) / 100) + (this.miles() / 14 * 50)));
  }

  render() {
    return (
      <div className={cx(spacing.marginBottomHalf, spacing.horizontalPadding)}>
        <div className={styles.elevationTotals}>
          <div className={styles.difficultyChart}>
            <DifficultyChart score={this.score()}/>
          </div>
          <div className={cx(styles.stat, styles.border)}>
            <Hiker className={styles.statIcon} />
            <div className={styles.statTotal}>{this.miles()}</div>
            <div className={styles.statLabel}>Miles</div>
          </div>
          <div className={cx(styles.stat)}>
            <Mountain className={cx(styles.statIcon, styles.mountain)} />
            <div className={styles.statTotal}>
              <NumberFormat value={metersToFeet(this.elevationGain())}
                displayType={'text'}
                thousandSeparator={true}
              />
            </div>
            <div className={styles.statLabel}>Elevation Gain</div>
          </div>
        </div>
        <LineGraph elevations={this.props.elevations}/>
      </div>
    )
  }

}
