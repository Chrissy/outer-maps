import React from 'react'
import styles from '../styles/difficultyChart.css';
import cx from 'classnames';

export default class DifficultyChart extends React.Component {

  rotation() {
    return 225 + (((this.props.score - 50) / 100) * 360);
  }

  render() {
    return (
      <div className={cx(styles.body, {[styles.halfEmpty]: this.props.score < 50})}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2} style={{transform: `rotate(${this.rotation()}deg)`}}></div>
      </div>
    )
  }
};
