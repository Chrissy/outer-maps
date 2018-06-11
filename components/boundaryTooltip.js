import React from "react";
import PropTypes from "prop-types";

import {metersToMiles} from "../modules/conversions";

const BoundaryTooltip = ({name, area}) => {
  return (
    <span>
      name: {name}<br/>
      distance: {metersToMiles(area)} Miles
    </span>
  );
};

BoundaryTooltip.propTypes = {
  name: PropTypes.string,
  area: PropTypes.number,
};

export default BoundaryTooltip;
