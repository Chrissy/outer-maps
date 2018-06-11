import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "../styles/importantWeather.css";
import spacing from "../styles/spacing.css";
import label from "../styles/label.css";
import center from "../styles/center.css";
import HighIcon from "../svg/weather-high.svg";
import LowIcon from "../svg/weather-low.svg";
import PrecipIcon from "../svg/weather-precip.svg";

const ImportantWeather = ({maxTemperature, minTemperature, chanceOfPercipitation}) => {
  const percentText = (integer) => {
    return (typeof(integer) == "number") ? parseInt(integer/10) + "%" : "0%";
  };

  const tempIsExtreme = (temp) => {
    if (temp > 75) return styles.hot;
    if (temp < 50) return styles.cold;
    return styles.normal;
  };

  return (
    <div>
      <div className={label.label}>Average weather this week</div>
      <div className={styles.importantWeather}>
        <div className={cx(styles.importantWeatherUnit, styles.high, tempIsExtreme(maxTemperature))}>
          <div className={center.flex}>
            <HighIcon className={styles.icon}/>
            <div className={styles.data}>{parseInt(maxTemperature)}°</div>
          </div>
          <div className={styles.label}>High Temperature</div>
        </div>
        <div className={cx(styles.importantWeatherUnit, styles.low, tempIsExtreme(minTemperature))}>
          <div className={center.flex}>
            <LowIcon className={styles.icon}/>
            <div className={styles.data}>{parseInt(minTemperature)}°</div>
          </div>
          <div className={styles.label}>Low Temperature</div>
        </div>
        <div className={cx(styles.importantWeatherUnit, styles.precip)}>
          <div className={center.flex}>
            <PrecipIcon className={styles.icon}/>
            <div className={styles.data}>{percentText(chanceOfPercipitation)}</div>
          </div>
          <div className={styles.label}>Chance percipitation</div>
        </div>
      </div>
    </div>
  );
};

ImportantWeather.propTypes = {
  maxTemperature: PropTypes.number,
  minTemperature: PropTypes.number,
  chanceOfPercipitation: PropTypes.number
};

export default ImportantWeather;
