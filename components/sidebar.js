import React from 'react';
import cx from 'classnames';
import Elevation from './elevation';
import Terrain from './terrain';
import TrailList from './trailList.js'
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

  name() {
    return (this.props.trails.length > 1) ? `${this.props.trails.length} Trails` : this.props.firstTrail.name;
  }

  terrain() {
    return <Terrain trail={this.props.firstTrail}/>
  }

  trailList() {
    return <TrailList trails={this.props.trails}/>
  }

  terrainOrTrailList() {
    return (this.props.trails.length > 1) ? this.trailList() : this.terrain()
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
    return '';
    if (this.props.firstTrail.hasWeatherData) return <a href="#" onClick={(e) => this.showMoreWeather(e)}>More Weather</a>
  }

  render() {
    return (
      <div className={cx(styles.body, {[styles.active]: this.props.loading})}>
        <div className={cx(styles.content, {[styles.active]: this.props.firstTrail.hasBaseData})}>
          <div className={styles.title}>{this.name()}</div>
          {this.terrainOrTrailList()}
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
