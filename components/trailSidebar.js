import React from 'react';
import PropTypes from 'prop-types';
import Elevation from './elevation';
import Terrain from './terrain';
import TrailListContainer from './trailListContainer.js'
import ImportantWeather from './importantWeather';
import LessImportantWeather from './lessImportantWeather';

const TrailSidebar = ({firstTrail, trails}) => {
  
  const terrain = () => {
    if (firstTrail.hasElevationData) {
      return <Terrain 
        index={`trail:${firstTrail.id}`} 
        height={firstTrail.dump.height} 
        width={firstTrail.dump.width} 
        bounds={firstTrail.bounds} 
        vertices={firstTrail.dump.vertices}/>      
    }
  }

  const trailList = () => {
    return <TrailListContainer/>
  }

  const terrainOrTrailList = () => {
    return (trails.length > 1) ? trailList() : terrain()
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

  return (
    <div>
      {terrainOrTrailList()}
      {elevation()}
      {importantWeather()}
      {lessImportantWeather()}
    </div>
  )
};

TrailSidebar.propTypes = {
  firstTrail: PropTypes.object,
  trails: PropTypes.array
}

export default TrailSidebar;
