import React from 'react';
import cx from 'classnames';
import Elevation from './elevation';
import Terrain from './terrain';
import LoadingSpinner from './loadingSpinner';
import ImportantWeather from './importantWeather';
import LessImportantWeather from './lessImportantWeather';

import styles from '../styles/sidebar.css';
import spacing from '../styles/spacing.css';

export default class MapSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.showMoreWeather = this.showMoreWeather.bind(this);
  }

  terrain() {
    return '';
    return <Terrain trail={this.props.firstTrail}/>
  }

  elevation() {
    if (this.props.firstTrail.hasElevationData) return <Elevation trails={this.props.trails.filter(t => t.hasElevationData)}/>
  }

  importantWeather() {
    if (this.props.firstTrail.hasWeatherData) return <ImportantWeather trail={this.props.firstTrail}/>
  }

  lessImportantWeather() {
    if (this.props.firstTrail.hasAdditionalWeatherData) {
      return <LessImportantWeather trail={this.props.firstTrail}/>
    }
  }

  showMoreWeather() {
    this.props.getAdditionalWeatherData(this.props.firstTrail);
  }

  showMoreWeatherButton() {
    if (this.props.firstTrail.hasWeatherData) return <a href="#" onClick={(e) => this.showMoreWeather(e)}>More Weather</a>
  }

  render() {
    return (
      <div className={cx(styles.body, {[styles.active]: this.props.loading})}>
        <div className={cx(styles.content, {[styles.active]: this.props.firstTrail.hasBaseData})}>
          <div className={styles.title}>{this.props.firstTrail.name}</div>
          {this.terrain()}
          {this.elevation()}
          {this.importantWeather()}
          {this.lessImportantWeather()}
          {this.showMoreWeatherButton()}
        </div>
        <div className={cx(styles.spinner, {[styles.hidden]: this.props.firstTrail.hasBaseData})}>
          <LoadingSpinner/>
        </div>
      </div>
    )
  }
};
