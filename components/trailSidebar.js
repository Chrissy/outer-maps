import React from 'react';
import PropTypes from 'prop-types';
import ElevationTotals from './elevationTotals';
import Terrain from './terrain';
import TrailListContainer from './trailListContainer';
import ImportantWeather from './importantWeather';
import LessImportantWeather from './lessImportantWeather';
import sliceElevationsWithHandles from '../modules/sliceElevationsWithHandles';
import connectPaths from '../modules/connectPaths';
import distance from '@turf/distance';
import _ from 'underscore';

const TrailSidebar = ({firstTrail, trails}) => {
  const cumulativeElevations = () => {
    return trails.reduce((accumulator, trail) => {
      const points = sliceElevationsWithHandles(trail).points;
      if (accumulator.length == 0) return points;
      return connectPaths(accumulator, points);
    }, []);
  }
  
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

  const elevationTotals = () => {
    if (firstTrail.hasElevationData) return <ElevationTotals elevations={cumulativeElevations()}/>
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
      {elevationTotals()}
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
