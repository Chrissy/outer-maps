import React from 'react'
import PropTypes from 'prop-types';
import cx from 'classnames';
import {metersToMiles} from '../modules/conversions';
import styles from '../styles/trailList.css';
import spacing from '../styles/spacing.css';
import Close from '../svg/close.svg';

const TrailList = ({trails, unselectTrail}) => {
  const trailDistance = ({points, hasElevationData}) => {
    if (!hasElevationData) return '';
    return metersToMiles(points.reduce((a, e) => {
      return a + e.distanceFromPreviousPoint
    }, 0)) + "m";
  }

  const listElement = (trail) => {
    return (
      <div className={cx(styles.listElement, spacing.marginBottomHalf)} key={trail.id}>
        <div className={styles.name}>{trail.name}</div>
        <div className={styles.info}>
          <div className={styles.dataElement}>{trailDistance(trail)}</div>
          <Close className={styles.close} onClick={(e) => unselectTrail(trail.id)}/>
        </div>
      </div>
    )
  }

  return (
    <div className={cx(styles.trailList, spacing.marginBottomTriple, spacing.marginTopHalf, spacing.horizontalPadding)}>
      {trails.map(t => listElement(t))}
    </div>
  )
};

TrailList.propTypes = {
  unselectTrail: PropTypes.func,
  trails: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    hasElevationData: PropTypes.bool,
    id: PropTypes.number,
    points: PropTypes.arrayOf(PropTypes.shape({
      distanceFromPreviousPoint: PropTypes.number
    }))
  }))
}

export default TrailList;
