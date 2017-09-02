import React from 'react';
import PropTypes from 'prop-types';

const TrailBreakdown = ({hike, bike, ohv, horse}) => {
  const total = () => hike + bike + ohv + horse;
  
  const percent = (number) => Math.round(number / total() * 100) + "%"
  
  return (
    <div>
      {percent(hike)} / {percent(bike)} / {percent(ohv)} / {percent(horse)}
    </div>
  )
}

TrailBreakdown.propTypes = {
  hike: PropTypes.number,
  bike: PropTypes.number,
  ohv: PropTypes.number,
  horse: PropTypes.number
}

export default TrailBreakdown;
