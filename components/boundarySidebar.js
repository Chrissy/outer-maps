import React from 'react';
import PropTypes from 'prop-types';
import Terrain from './terrain';
import TrailTypes from './trailTypes';
import BoundaryTotals from './boundaryTotals';
import styles from '../styles/boundarySidebar.css';

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
      return <TrailTypes {...boundary.trailTypes}/>
    }
  }

  return (
    <div className={styles.boundarySidebar}>
      {terrain()}
      {boundaryTotals()}
      {trailTypes()}
    </div>
  )
};

BoundarySidebar.propTypes = {
  boundary: PropTypes.object
};

export default BoundarySidebar;


