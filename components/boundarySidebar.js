import React from 'react';
import Terrain from './terrain';

export default ({boundary}) => {
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
