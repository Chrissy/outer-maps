import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import ElevationTotals from "./elevationTotals";
import TrailListContainer from "./trailListContainer";
import ImportantWeather from "./importantWeather";
import connectPaths from "../modules/connectPaths";

const TrailSidebar = ({ firstTrail, trails }) => {
  const cumulativeElevations = () => {
    return trails
      .filter(t => t.hasElevationData)
      .reduce((accumulator, trail) => {
        const points = trail.points;
        if (accumulator.length == 0) return points;
        return connectPaths(accumulator, points);
      }, []);
  };

  const trailList = () => {
    return (
      <div style={{ display: trails.length > 1 ? "block" : "none" }}>
        <TrailListContainer trails={trails} />
      </div>
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
      {trailList()}
      {elevationTotals()}
      {importantWeather()}
    </div>
  );
};

TrailSidebar.propTypes = {
  firstTrail: PropTypes.object,
  trails: PropTypes.array,
  handles: PropTypes.array
};

const StyledImportantWeather = styled(ImportantWeather)`
  padding: 0 ${p => p.theme.ss(1)};
  margin: 0 ${p => p.theme.ss(1)};
`;

export default TrailSidebar;
