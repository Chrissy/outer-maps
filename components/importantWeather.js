import React from 'react';
import cx from 'classnames';
import styles from '../styles/importantWeather.css';
import spacing from '../styles/spacing.css';
import label from '../styles/label.css';
import center from '../styles/center.css';
import HighIcon from '../svg/weather-high.svg';
import LowIcon from '../svg/weather-low.svg';
import PrecipIcon from '../svg/weather-precip.svg';


export default class ImportantWeather extends React.Component {
  percentText(integer) {
    return (typeof(integer) == "number") ? parseInt(integer/10) + "%" : "0%";
  }

  tempIsExtreme(temp) {
    if (temp > 75) return styles.hot;
    if (temp < 50) return styles.cold;
    return styles.normal;
  }

  render() {
    return (
      <div className={cx(spacing.horizontalPadding, spacing.marginTop)}>
        <div className={label.label}>Average weather this week</div>
        <div className={styles.importantWeather}>
          <div className={cx(styles.importantWeatherUnit, styles.high, this.tempIsExtreme(this.props.trail.maxTemperature))}>
            <div className={center.flex}>
              <HighIcon className={styles.icon}/>
              <div className={styles.data}>{parseInt(this.props.trail.maxTemperature)}°</div>
            </div>
            <div className={styles.label}>High Temperature</div>
          </div>
          <div className={cx(styles.importantWeatherUnit, styles.low, this.tempIsExtreme(this.props.trail.minTemperature))}>
            <div className={center.flex}>
              <LowIcon className={styles.icon}/>
              <div className={styles.data}>{parseInt(this.props.trail.minTemperature)}°</div>
            </div>
            <div className={styles.label}>Low Temperature</div>
          </div>
          <div className={cx(styles.importantWeatherUnit, styles.precip)}>
            <div className={center.flex}>
              <PrecipIcon className={styles.icon}/>
              <div className={styles.data}>{this.percentText(this.props.trail.chanceOfPercipitation)}</div>
            </div>
            <div className={styles.label}>Chance of percipitation</div>
          </div>
        </div>
      </div>
    )
  }
}
