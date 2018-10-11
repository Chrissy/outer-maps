import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import ElevationTotals from "./elevationTotals";
import TrailListContainer from "./trailListContainer";
import ImportantWeather from "./importantWeather";
import connectPaths from "../modules/connectPaths";
import _ from "underscore";

const TrailSidebar = ({ firstTrail, trails, terrain }) => {
  const cumulativeElevations = () => {
    return _.flatten(
      trails.filter(t => t.hasElevationData).reduce((accumulator, trail, i) => {
        const points = trail.points;
        return i == 0
          ? [points]
          : [
            ...accumulator.slice(0, -1),
            ...connectPaths(trails[i - 1].points, points)
          ];
      }, [])
    );
  };

  const elevationTotals = () => {
    if (firstTrail.hasElevationData)
      return <ElevationTotals elevations={cumulativeElevations()} />;
  };

  const importantWeather = () => {
    if (firstTrail.hasWeatherData)
      return <StyledImportantWeather {...firstTrail.weatherData} />;
  };

  return (
    <div>
      <TrailListContainer trails={trails} />
      {terrain}
      {elevationTotals()}
      {importantWeather()}
    </div>
  );
};

TrailSidebar.propTypes = {
  firstTrail: PropTypes.object,
  trails: PropTypes.array,
  handles: PropTypes.array,
  terrain: PropTypes.element
};

const StyledImportantWeather = styled(ImportantWeather)`
  padding: 0 ${p => p.theme.ss(1)};
  margin: ${p => p.theme.ss(1)} 0;
`;

export default TrailSidebar;
