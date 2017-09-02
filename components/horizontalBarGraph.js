import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/horizontalBarGraph.css';

const trailLengths = ({keys, values}) => {
  const toPercentageWidth = (value) => Math.round(value / Math.max(...values)) * 100 + "%";
  
  const pairsToGraph = () => {
    return values.map((value, i) => (
      <div className={styles.bar}>
        <div className={styles.barColor} styles={{width: toPercentageWidth(value)}}></div>
        <div className={styles.barLabel}>{keys[i]}</div>
      </div>
    ))
  }
  
  return (
    <div>
      {pairsToGraph()}
    </div>
  )
}

trailLengths.propTypes = {
  keys: PropTypes.array,
  values: PropTypes.array
}

export default trailLengths;
