import React from 'react'
import styles from '../styles/difficultyChart.css';
import center from '../styles/center.css';
import cx from 'classnames';

export default class DifficultyChart extends React.Component {

  rotation() {
    return ((this.props.score > 50) ? 225 : 45) + (((this.props.score - 50) / 100) * 360);
  }

  difficulty() {
    if (this.props.score < 25) return 'Very Easy';
    if (this.props.score < 50) return 'Easy';
    if (this.props.score < 75) return 'Moderate';
    if (this.props.score < 96) return 'Strenuous';
    if (this.props.score >= 96) return 'Extreme';
  }

  difficultyClass() {
    return this.difficulty().replace(/\s+/g, '').toLowerCase();
  }

  render() {
    return (
      <div className={cx(styles.body, center.flex, styles[this.difficultyClass()], {[styles.halfEmpty]: this.props.score < 50})}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2} style={{transform: `rotate(${this.rotation()}deg)`}}></div>
        <div className={cx(styles.innerCircle, center.flex)}>
          <div className={styles.label}>Difficulty</div>
          <div className={styles.score}>{this.props.score}</div>
          <div className={styles.difficulty}>{this.difficulty()}</div>
        </div>
      </div>
    )
  }
};
