import React from "react";
import {metersToMiles} from "../modules/conversions";

const BoundaryTooltip = ({name, area}) => {
  return (
    <span>
      name: {name}<br/>
      distance: {metersToMiles(area)} Miles
    </span>
  );
};

export default BoundaryTooltip;
