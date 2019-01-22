import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import ElevationTotals from "./elevationTotals";
import TrailListContainer from "./trailListContainer";
import ImportantWeather from "./importantWeather";
import theme from "../styles/theme";

const TrailSidebar = ({ firstTrail, trails, terrain }) => {
  const cumulativeElevations = () => {
    return trails
      .filter(t => t.hasElevationData)
      .reduce((accumulator, trail) => {
        const points = trail.points;
        if (accumulator.length == 0) return points;
        return [...accumulator, ...points];
      }, []);
  };

  const elevationTotals = () => {
    if (firstTrail.hasElevationData)
      return (
        <ElevationTotals
          elevations={cumulativeElevations()}
          colors={trails.map(t => theme.trailColor(t.uniqueId - 1))}
        />
      );
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
