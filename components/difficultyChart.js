import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/difficultyChart.css";
import center from "../styles/center.css";
import label from "../styles/label.css";
import cx from "classnames";

const DifficultyChart = ({score}) => {

  const rotation = () => {
    return ((score > 50) ? 225 : 45) + (((score - 50) / 100) * 360);
  };

  const difficulty = () => {
    if (score < 25) return "Very Easy";
    if (score < 50) return "Easy";
    if (score < 75) return "Moderate";
    if (score < 96) return "Strenuous";
    if (score >= 96) return "Extreme";
  };

  const difficultyClass = () => {
    return difficulty().replace(/\s+/g, "").toLowerCase();
  };

  return (
    <div className={cx(styles.body, center.flex, styles[difficultyClass()], {[styles.halfEmpty]: score < 50})}>
      <div className={styles.circle1}></div>
      <div className={styles.circle2} style={{transform: `rotate(${rotation()}deg)`}}></div>
      <div className={cx(styles.innerCircle, center.flex)}>
        <div className={styles.data}>
          <div className={cx(styles.label, label.label)}>Difficulty</div>
          <div className={styles.score}>{score}</div>
          <div className={styles.difficulty}>{difficulty()}</div>
        </div>
      </div>
    </div>
  );
};

DifficultyChart.propTypes = {
  score: PropTypes.number
};

export default DifficultyChart;
