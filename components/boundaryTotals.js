import React from 'react';
import PropTypes from 'prop-types';
import numberShortener from '../modules/numberShortener';
import {metersToFeet, metersToMiles} from '../modules/conversions';

const BoundaryTotals = ({area, trailsCount, highPoint}) => {
  return (
    <div>
    {numberShortener(metersToMiles(area))} / 
    {numberShortener(trailsCount)} / 
    {new Intl.NumberFormat().format(parseInt(metersToFeet(highPoint)))} /
    </div>
  )
}

BoundaryTotals.propTypes = {
  area: PropTypes.number,
  trailsCount: PropTypes.number,
  highPoint: PropTypes.number
}

export default BoundaryTotals;
