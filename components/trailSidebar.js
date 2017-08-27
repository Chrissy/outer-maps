import React from 'react';
import Elevation from './elevation';
import Terrain from './terrain';
import TrailListContainer from './trailListContainer.js'
import ImportantWeather from './importantWeather';
import LessImportantWeather from './lessImportantWeather';

export default class MapSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.showMoreWeather = this.showMoreWeather.bind(this);
  }

  terrain() {
    return <Terrain trail={this.props.firstTrail}/>
  }

  trailList() {
    return <TrailListContainer/>
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
      <div>
        {this.terrainOrTrailList()}
        {this.elevation()}
        {this.importantWeather()}
        {this.lessImportantWeather()}
        {this.showMoreWeatherButton()}
      </div>
    )
  }
};
