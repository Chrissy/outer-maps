import React from 'react';
import PropTypes from 'prop-types';
import Terrain from './terrain';
import BoundaryTotals from './boundaryTotals';

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

  return (
    <div>
      {terrain()}
      {boundaryTotals()}
    </div>
  )
};

BoundarySidebar.propTypes = {
  boundary: PropTypes.object
};

export default BoundarySidebar;


