import React from "react";
import PropTypes from "prop-types";
import { metersToMiles, convertToTitleCase } from "../modules/conversions";
import { feature } from "@turf/helpers";

const TrailTooltip = ({ name, distance }) => {
  return (
    <span>
      name: {convertToTitleCase(name == "null" ? "unknown" : name)}
      <br />
      distance: {metersToMiles(feature(distance) * 1000)} Miles<br />
    </span>
  );
};

TrailTooltip.propTypes = {
  name: PropTypes.string,
  distance: PropTypes.integer
};

export default TrailTooltip;
