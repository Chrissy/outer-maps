import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import TrailTypes from "./trailTypes";
import HorizontalBarGraph from "./horizontalBarGraph";
import BoundaryTotals from "./boundaryTotals";
import TrailsChartElement from "./trailsChartElement";
import Label from "./label";
import ImportantWeather from "./importantWeather";

const BoundarySidebar = ({
  hasElevationData,
  area,
  trails,
  trailTypes,
  trailLengths,
  highPoint,
  hasWeatherData,
  weatherData
}) => {
  const boundaryTotals = () => {
    if (hasElevationData) {
      return (
        <BoundaryTotals
          area={area}
          trailsCount={trails.length}
          highPoint={highPoint}
        />
      );
    }
  };

  const trailTypesBreakdown = () => {
    if (hasElevationData) {
      return (
        <div>
          <BoundaryLabel>Trail Breakdown</BoundaryLabel>
          <TrailTypes {...trailTypes} />
        </div>
      );
    }
  };

  const trailsChart = () => {
    if (hasElevationData && trails.length) {
      return (
        <div>
          <BoundaryLabel>Long Trails</BoundaryLabel>
          {trails.map(t => (
            <TrailsChartElement
              key={t.id}
              id={t.id}
              name={t.name}
              distance={t.length}
            />
          ))}
        </div>
      );
    }
  };

  const trailLengthsBreakdown = () => {
    if (hasElevationData && trailLengths.length) {
      return (
        <div>
          <BoundaryLabel>Mileage Breakdown</BoundaryLabel>
          <HorizontalBarGraph
            keys={trailLengths.map(p => p[0])}
            values={trailLengths.map(p => p[1])}
          />
        </div>
      );
    }
  };

  const importantWeather = () => {
    if (hasWeatherData)
      return (
        <WeatherContainer>
          <ImportantWeather {...weatherData} />
        </WeatherContainer>
      );
  };

  return (
    <React.Fragment>
      {boundaryTotals()}
      <Container>
        {trailTypesBreakdown()}
        {trailsChart()}
        {trailLengthsBreakdown()}
      </Container>
      {importantWeather()}
    </React.Fragment>
  );
};

BoundarySidebar.propTypes = {
  id: PropTypes.number,
  hasElevationData: PropTypes.bool,
  highPoint: PropTypes.number,
  area: PropTypes.number,
  trails: PropTypes.array,
  trailTypes: PropTypes.object,
  trailLengths: PropTypes.array,
  bounds: PropTypes.array,
  hasWeatherData: PropTypes.bool,
  weatherData: PropTypes.object
};

const Container = styled("div")`
  display: grid;
  grid-template-rows: max-content;
  grid-template-columns: 1fr;
  grid-gap: ${p => p.theme.ss(1.5)};
  padding: ${p => p.theme.ss(1)};
`;

const BoundaryLabel = styled(Label)`
  margin-bottom: ${p => p.theme.ss(0.5)};
`;

const WeatherContainer = styled("div")`
  padding: 0 ${p => p.theme.ss(1)};
  margin: ${p => p.theme.ss(1)} 0;
`;

export default BoundarySidebar;
