import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import numberShortener from '../modules/numberShortener';
import {metersToFeet, metersToMiles} from '../modules/conversions';
import styles from '../styles/boundaryTotals.css';
import stat from '../styles/stat.css';
import Mountain from '../svg/mountain.svg';
import Path from '../svg/path.svg';
import Squares from '../svg/squares.svg';

const BoundaryTotals = ({area, trailsCount, highPoint}) => {
  return (
    <div className={styles.boundaryTotals}>
      <div className={cx(stat.stat, stat.border)}>
        <Squares className={stat.icon} />
        <div className={stat.total}>{numberShortener(metersToMiles(area))}</div>
        <div className={stat.label}>Miles²</div>
      </div>
      <div className={cx(stat.stat, stat.border)}>
        <Path className={cx(stat.icon, stat.path)} />
        <div className={stat.total}>{numberShortener(trailsCount)}</div>
        <div className={stat.label}>Trails</div>
      </div>
      <div className={stat.stat}>
        <Mountain className={cx(stat.icon, stat.mountain)} />
        <div className={stat.total}>{numberShortener(parseInt(metersToFeet(highPoint)))}</div>
        <div className={stat.label}>High Point</div>
      </div>
    </div>
  )
}

BoundaryTotals.propTypes = {
  area: PropTypes.number,
  trailsCount: PropTypes.number,
  highPoint: PropTypes.number
}

export default BoundaryTotals;
