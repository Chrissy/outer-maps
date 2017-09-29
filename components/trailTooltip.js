import React from 'react'
import {metersToMiles, convertToTitleCase} from '../modules/conversions'
import {feature} from '@turf/helpers'

const TrailTooltip = ({name, distance}) => {
  return (
    <span>
      name: {convertToTitleCase(name == 'null' ? 'unknown' : name)}<br/>
      distance: {metersToMiles(lineDistance(feature(distance)) * 1000)} Miles<br/>
    </span>
  )
};

export default TrailTooltip;
