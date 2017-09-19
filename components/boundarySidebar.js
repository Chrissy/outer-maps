import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Terrain from './terrain';
import TrailTypes from './trailTypes';
import HorizontalBarGraph from './horizontalBarGraph';
import BoundaryTotals from './boundaryTotals';
import TrailsChartElement from './trailsChartElement';
import styles from '../styles/boundarySidebar.css';
import label from '../styles/label.css';
import spacing from '../styles/spacing.css';
import ImportantWeather from './importantWeather';

const BoundarySidebar = ({id, hasElevationData, vertices, area, trails, trailTypes, trailLengths, bounds, trailsCount, hasWeatherData, weatherData, hasSatelliteImage, satelliteImageUrl}) => {
  const terrain = () => {
    return <Terrain
      index={`boundary:${id}`}
      satelliteImageUrl={satelliteImageUrl}
      vertices={vertices}/>
  }

  const boundaryTotals = () => {
    if (hasElevationData) {
      return <BoundaryTotals
        area={area}
        trailsCount={trailsCount}
        highPoint={Math.max(...vertices)}/>
    }
  }

  const trailTypesBreakdown = () => {
    if (hasElevationData) {
      return (
        <div className={styles.trailTypesBreakdown}>
          <div className={cx(label.label, spacing.marginBottomHalf)}>Trail Breakdown</div>
          <TrailTypes {...trailTypes}/>
        </div>
      )
    }
  }

  const trailsChart = () => {
    if (hasElevationData && trails.length) {
      return (
        <div className={styles.trailsChart}>
          <div className={cx(label.label, spacing.marginBottomHalf)}>Long Trails</div>
          {trails.map(t => <TrailsChartElement key={t.id} id={t.id} name={t.name} distance={t.length}/>)}
        </div>
      )
    }
  }

  const trailLengthsBreakdown = () => {
    if (hasElevationData && trailLengths.length) {
      return (
        <div className={styles.trailLengthsBreakdown}>
          <div className={cx(label.label, spacing.marginBottomHalf)}>Mileage Breakdown</div>
          <HorizontalBarGraph
            keys={trailLengths.map(p => p[0])}
            values={trailLengths.map(p => p[1])} />
        </div>
      )
    }
  }

  const importantWeather = () => {
    if (hasWeatherData) return (
      <div className={cx(spacing.horizontalPadding, spacing.marginTop, spacing.marginBottom)}>
        <ImportantWeather {...weatherData}/>
      </div>
    )
  }

  return (
    <div className={styles.boundarySidebar}>
      {boundaryTotals()}
      <div className={styles.boundarySidebarGridLayout}>
        {trailTypesBreakdown()}
        {trailsChart()}
        {trailLengthsBreakdown()}
      </div>
      {importantWeather()}
    </div>
  )
};

BoundarySidebar.propTypes = {
  id: PropTypes.number,
  hasElevationData: PropTypes.bool,
  dump: PropTypes.object,
  area: PropTypes.number,
  trails: PropTypes.array,
  trailTypes: PropTypes.object,
  trailLengths: PropTypes.array,
  bounds: PropTypes.array,
  hasWeatherData: PropTypes.bool,
  weatherData: PropTypes.object,
  hasSatelliteImage: PropTypes.bool,
  satelliteImageUrl: PropTypes.string
};

export default BoundarySidebar;
