import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ElevationTotals from './elevationTotals';
import TrailListContainer from './trailListContainer';
import ImportantWeather from './importantWeather';
import sliceElevationsWithHandles from '../modules/sliceElevationsWithHandles';
import connectPaths from '../modules/connectPaths';
import spacing from '../styles/spacing.css';

const TrailSidebar = ({firstTrail, trails, handles}) => {
  const slicedTrails = () => {
    return trails.map(t => sliceElevationsWithHandles(t, handles));
  }

  const cumulativeElevations = () => {
    return slicedTrails().filter(t => t.hasElevationData).reduce((accumulator, trail) => {
      const points = trail.points;
      if (accumulator.length == 0) return points;
      return connectPaths(accumulator, points);
    }, []);
  }

  const terrain = () => {
    return '';
  }

  const trailList = () => {
    return <TrailListContainer trails={slicedTrails()} />
  }

  const terrainOrTrailList = () => {
    return (trails.length > 1) ? trailList() : terrain()
  }

  const elevationTotals = () => {
    if (firstTrail.hasElevationData) return <ElevationTotals elevations={cumulativeElevations()}/>
  }

  const importantWeather = () => {
    if (firstTrail.hasWeatherData) return (
      <div className={cx(spacing.horizontalPadding, spacing.marginTop, spacing.marginBottom)}>
        <ImportantWeather {...firstTrail.weatherData}/>
      </div>
    )
  }

  return (
    <div>
      {terrainOrTrailList()}
      {elevationTotals()}
      {importantWeather()}
    </div>
  )
};

TrailSidebar.propTypes = {
  firstTrail: PropTypes.object,
  trails: PropTypes.array,
  handles: PropTypes.array
}

export default TrailSidebar;
