import React from 'react';
import PropTypes from 'prop-types';
import {metersToMiles} from '../modules/conversions';
import styles from '../styles/trailsChartElement.css';
import numberShortener from '../modules/numberShortener';

const TrailsChartElement = ({name, url, distance, id}) => {
  const formatDistance = (distance) => numberShortener({number: metersToMiles(distance), oneDecimal: true});
   
  return (
    <div className={styles.trailsChartElement}>
      <div id={id} className={styles.name}>{name}</div>
      <div className={styles.distance}>{formatDistance(distance)}</div>
    </div>
  )
}

TrailsChartElement.propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    distance: PropTypes.number,
    id: PropTypes.number
}

export default TrailsChartElement;
