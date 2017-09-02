import React from 'react';
import PropTypes from 'prop-types';
import LineGraph from './lineGraph';
import DifficultyChart from './difficultyChart';
import Hiker from '../svg/hiker.svg';
import Mountain from '../svg/mountain.svg';
import {metersToFeet, metersToMiles} from '../modules/conversions';
import styles from '../styles/elevationTotals.css';
import cx from 'classnames';
import NumberFormat from 'react-number-format';
import spacing from '../styles/spacing.css';

const ElevationTotals = ({elevations}) => {
  const elevationGain = () => {
    return elevations.reduce((a, e) => a + e.elevationGain, 0);
  }

  const elevationLoss = () => {
    return elevations.reduce((a, e) => a + e.elevationLoss, 0);
  }

  const distance = () => {
    return elevations.reduce((a, e) => a + e.distanceFromPreviousPoint, 0);
  }

  const miles = () => {
    return metersToMiles(distance())
  }

  const score = () => {
    return Math.min(100, parseInt((metersToFeet(elevationGain()) / 100) + (miles() / 14 * 50)));
  }

  return (
    <div className={cx(spacing.marginBottomHalf, spacing.horizontalPadding)}>
      <div className={styles.elevationTotals}>
        <div className={styles.difficultyChart}>
          <DifficultyChart score={score()}/>
        </div>
        <div className={cx(styles.stat, styles.border)}>
          <Hiker className={styles.statIcon} />
          <div className={styles.statTotal}>{miles()}</div>
          <div className={styles.statLabel}>Miles</div>
        </div>
        <div className={cx(styles.stat)}>
          <Mountain className={cx(styles.statIcon, styles.mountain)} />
          <div className={styles.statTotal}>
            <NumberFormat value={metersToFeet(elevationGain())}
              displayType={'text'}
              thousandSeparator={true}
            />
          </div>
          <div className={styles.statLabel}>Elevation Gain</div>
        </div>
      </div>
      <LineGraph elevations={elevations}/>
    </div>
  )
};

ElevationTotals.propTypes = {
  trails: PropTypes.array
}

export default ElevationTotals;
