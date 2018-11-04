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
  weatherData,
  terrain,
  name
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
      <VitalsContainer>
        <NameContainer>
          <Name>{name}</Name>
        </NameContainer>
        <BoundaryTotalsContainer>{boundaryTotals()}</BoundaryTotalsContainer>
        {terrain}
        <GradientOverlay />
      </VitalsContainer>
      <DataContainer>
        {trailTypesBreakdown()}
        {trailsChart()}
        {trailLengthsBreakdown()}
      </DataContainer>
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
  weatherData: PropTypes.object,
  terrain: PropTypes.element,
  name: PropTypes.string
};

const DataContainer = styled("div")`
  display: grid;
  grid-template-rows: max-content;
  grid-template-columns: 1fr;
  grid-gap: ${p => p.theme.ss(1.5)};
  padding: ${p => p.theme.ss(1)};
`;

const VitalsContainer = styled("div")`
  width: 100%;
  position: relative;
`;

const GradientOverlay = styled("div")`
  background: linear-gradient(rgba(19, 19, 10, 0), rgba(19, 19, 10, 1));
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
`;

const NameContainer = styled("div")`
  background: rgba(19, 19, 19, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  padding: ${p => p.theme.ss(0.5)} ${p => p.theme.ss(0.75)}
    ${p => p.theme.ss(0.75)};
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
`;

const Name = styled("h1")`
  color: #fff;
  font-weight: 700;
  font-size: ${p => p.theme.ts(1.25)};
  margin: 0;
  -webkit-font-smoothing: antialiased;
`;

const BoundaryTotalsContainer = styled("div")`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
  z-index: 1;
  margin-bottom: ${p => p.theme.ss(0.5)};
`;

const BoundaryLabel = styled(Label)`
  margin-bottom: ${p => p.theme.ss(0.5)};
`;

const WeatherContainer = styled("div")`
  padding: 0 ${p => p.theme.ss(1)};
  margin: ${p => p.theme.ss(1)} 0;
`;

export default BoundarySidebar;
