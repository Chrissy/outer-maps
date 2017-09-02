import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Terrain from './terrain';
import TrailTypes from './trailTypes';
import HorizontalBarGraph from './horizontalBarGraph';
import BoundaryTotals from './boundaryTotals';
import styles from '../styles/boundarySidebar.css';
import label from '../styles/label.css';
import spacing from '../styles/spacing.css';

const BoundarySidebar = ({boundary}) => {
  const terrain = () => {
    if (boundary.hasElevationData) {
      return <Terrain 
        index={`boundary:${boundary.id}`} 
        height={boundary.dump.height} 
        width={boundary.dump.width} 
        bounds={boundary.bounds} 
        vertices={boundary.dump.vertices}/>      
    }
  }
  
  const boundaryTotals = () => {
    if (boundary.hasElevationData) {
      return <BoundaryTotals 
        area={boundary.area}
        trailsCount={boundary.trailsCount}
        highPoint={Math.max(...boundary.dump.vertices)}/>
    }
  }
  
  const trailTypes = () => {
    if (boundary.hasElevationData) {
      return (
        <div className={cx(spacing.horizontalPadding, spacing.verticalPadding)}>
          <div className={cx(label.label, spacing.marginBottomHalf)}>Trail Breakdown</div>
          <TrailTypes {...boundary.trailTypes}/>
        </div>
      )
    }
  }
  
  const trailLengths = () => {
    if (boundary.hasElevationData && boundary.trailLengths.length) {
      return (
        <div className={cx(spacing.horizontalPadding, spacing.verticalPadding)}>
          <div className={cx(label.label, spacing.marginBottomHalf)}>Trail Breakdown</div>
          <HorizontalBarGraph 
            keys={boundary.trailLengths.map(p => p[0])} 
            values={boundary.trailLengths.map(p => p[1])} />
        </div>
      )
    }
  }

  return (
    <div className={styles.boundarySidebar}>
      {terrain()}
      {boundaryTotals()}
      {trailTypes()}
      {trailLengths()}
    </div>
  )
};

BoundarySidebar.propTypes = {
  boundary: PropTypes.object
};

export default BoundarySidebar;


