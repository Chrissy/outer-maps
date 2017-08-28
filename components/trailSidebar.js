import React from 'react';
import Elevation from './elevation';
import Terrain from './terrain';
import TrailListContainer from './trailListContainer.js'
import ImportantWeather from './importantWeather';
import LessImportantWeather from './lessImportantWeather';

export default ({firstTrail, trails}) => {
  
  const terrain = () => {
    return <Terrain trail={firstTrail}/>
  }

  const trailList = () => {
    return <TrailListContainer/>
  }

  const terrainOrTrailList = () => {
    return (trails.length > 1) ? this.trailList() : this.terrain()
  }

  const elevation = () => {
    if (firstTrail.hasElevationData) return <Elevation trails={trails.filter(t => t.hasElevationData)}/>
  }

  const importantWeather = () => {
    if (firstTrail.hasWeatherData) return <ImportantWeather trail={firstTrail}/>
  }

  const lessImportantWeather = () => {
    if (firstTrail.hasAdditionalWeatherData) {
      return <LessImportantWeather trail={firstTrail}/>
    }
  }

  const showMoreWeatherButton = () => {
    return '';
    if (firstTrail.hasWeatherData) return <a href="#" onClick={(e) => this.showMoreWeather(e)}>More Weather</a>
  }

  return (
    <div>
      {terrainOrTrailList()}
      {elevation()}
      {importantWeather()}
      {lessImportantWeather()}
      {showMoreWeatherButton()}
    </div>
  )
};
