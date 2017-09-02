import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from '../styles/trailTypes.css';
import spacing from '../styles/spacing.css';
import label from '../styles/label.css';
import Hike from '../svg/transportation-hike.svg';
import Bike from '../svg/transportation-bike.svg';
import Ohv from '../svg/transportation-ohv.svg';
import Horse from '../svg/transportation-horse.svg';

const TrailTypes = ({hike, bike, ohv, horse}) => {
  const total = () => hike + bike + ohv + horse;
  
  const percent = (number) => Math.round(number / total() * 100) + "%"
  
  return (
    <div>
      <div className={cx(styles.percentBar, spacing.marginBottom)}>
        <div className={styles.percentBarBar} style={{width: percent(hike)}}></div>
        <div className={styles.percentBarBar} style={{width: percent(horse)}}></div>
        <div className={styles.percentBarBar} style={{width: percent(bike)}}></div>
        <div className={styles.percentBarBar} style={{width: percent(ohv)}}></div>
      </div>
      <div className={styles.trailTypes}>
        <div className={styles.type}>
          <Hike className={styles.icon}/>
          {percent(hike)} Hike
        </div>
        <div className={styles.type}>
          <Horse className={styles.icon}/>
          {percent(horse)} Horse
        </div>
        <div className={styles.type}>
          <Bike className={styles.icon}/>
          {percent(bike)} Bike
        </div>
        <div className={styles.type}>
          <Ohv className={styles.icon}/>
          {percent(ohv)} OHV
        </div>
      </div>
    </div>
  )
}

TrailTypes.propTypes = {
  hike: PropTypes.number,
  bike: PropTypes.number,
  ohv: PropTypes.number,
  horse: PropTypes.number
}

export default TrailTypes;
