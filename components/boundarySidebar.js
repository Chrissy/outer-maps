import React from 'react';
import PropTypes from 'prop-types';
import Terrain from './terrain';

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

  return (
    <div>
      {terrain()}
    </div>
  )
};

BoundarySidebar.propTypes = {
  boundary: PropTypes.object
};

export default BoundarySidebar;


