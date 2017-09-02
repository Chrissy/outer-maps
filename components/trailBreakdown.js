import React from 'react';
import PropTypes from 'prop-types';

const trailBreakdown = ({hike, bike, ohv, horse}) => {
  return (
    <div>
      {hike} / {bike} / {ohv} / {horse}
    </div>
  )
}