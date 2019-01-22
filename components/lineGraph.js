import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { metersToMiles, metersToFeet } from "../modules/conversions";
import { flexCenter } from "../styles/flex";

const width = 275;
const height = 110;
const offset = 25;

const TextMarker = ({ stepWidth, step, every }) => {
  if (step % every !== 0) return;
  return (
    <Marker x={stepWidth * step + 2} y={9}>
      {step + 1}
    </Marker>
  );
};

TextMarker.propTypes = {
  stepWidth: PropTypes.number,
  step: PropTypes.number,
  every: PropTypes.number
};

const MileMarker = ({ stepWidth, step, iterations }) => {
  let every = 1;
  if (iterations > 7) every = 2;
  if (iterations > 20) every = 5;
  if (iterations > 50) every = 10;
  return (
    <g key={step}>
      <StyledRect
        x={stepWidth * step}
        width={stepWidth}
        height={height}
        shouldFill={Math.floor(step / every) % 2 !== 0 ? false : true}
      />
      {TextMarker({ stepWidth, step, iterations, every })}
    </g>
  );
};

MileMarker.propTypes = {
  stepWidth: PropTypes.number,
  step: PropTypes.number,
  iterations: PropTypes.number,
  leftOver: PropTypes.number
};

const LineGraph = ({ elevations, colors, className }) => {
  const getDistances = () => {
    return elevations
      .map(p => p.distanceFromPreviousPoint)
      .reduce((a, p) => a.concat(p + a[a.length - 1] || 0), []);
  };

  const getRelativePoints = () => {
    const es = elevations.map(e => e.elevation);
    const maxElevation = Math.max(...es);
    const elevationWindow = maxElevation - Math.min(...es);
    const distances = getDistances();
    const fullDistance = distances[distances.length - 1];

    return es.map((elevation, i) => {
      const y = (maxElevation - elevation) / elevationWindow;
      const x = distances[i] / fullDistance;
      // we don't want the chart to go all the way to the top
      // so we multiply the y value by a number like 0.823
      const squish = (100 - offset) * 0.01;

      return [y * squish, x, elevation, elevations[i].id];
    });
  };

  const pointsToPathString = relativePoints => {
    const lastPoint = relativePoints[relativePoints.length - 1];
    const firstPoint = relativePoints[0];
    return (
      relativePoints.reduce(
        (a, p) => a + `${p[1] * width},${p[0] * height + offset} `,
        `${firstPoint[1] * width},${height} `
      ) + `${lastPoint[1] * width},${height}`
    );
  };

  const mileMarkers = () => {
    const distances = getDistances();
    const miles = metersToMiles(distances[distances.length - 1]);
    const iterations = Math.floor(miles); // the eighth iteration will extend into 8.5;
    const extendBeyondBox = miles / iterations; // will return something like 1.1234;
    const stepWidth = (width * extendBeyondBox) / iterations; // we want to exend beyond the width
    let markers = [];
    for (let step = 0; step < iterations; step++) {
      markers.push(MileMarker({ stepWidth, step, iterations }));
    }
    return markers;
  };

  const getIdealPointsForAltitudeMarkers = relativePoints => {
    const highPoints = [...relativePoints]
      .sort((p1, p2) => {
        return p1[0] - p2[0]; // relative points are backwards
      })
      .slice(0, 3);

    const lowPoints = [...relativePoints]
      .sort((p1, p2) => {
        return p2[0] - p1[0]; // relative points are backwards
      })
      .slice(0, 3);

    const idealPointsUnfiltered = [
      relativePoints[0],
      ...highPoints,
      ...lowPoints,
      relativePoints[relativePoints.length - 1]
    ].sort((p1, p2) => p1[1] - p2[1]);

    return idealPointsUnfiltered.filter((p, i) => {
      if (i == 0) return true;
      if (p[1] < 0.2) return false;
      if (
        idealPointsUnfiltered[i + 1] &&
        Math.abs(idealPointsUnfiltered[i + 1][1] - p[1]) < 0.2
      )
        return false;
      return true;
    });
  };

  const getAltitudeMarkers = relativePoints => {
    const points = getIdealPointsForAltitudeMarkers(relativePoints);

    return points.map(p => (
      <ElevationMarker y={p[0] * 100} x={p[1] * 100} key={p[1]}>
        {metersToFeet(p[2]).toLocaleString()}
      </ElevationMarker>
    ));
  };

  const viewBox = () => `0 0 ${width} ${height}`;
  const relativePoints = getRelativePoints();
  const altitudeMarkers = getAltitudeMarkers(relativePoints);
  const groupedPoints = new Map();
  relativePoints.forEach(point => {
    const prevPoints = groupedPoints.get(point[3]);
    groupedPoints.set(point[3], prevPoints ? [...prevPoints, point] : [point]);
  });
  const relativePointsArr = [...groupedPoints.values()];

  return (
    <Container className={className}>
      <StyledSvg viewBox={viewBox()}>
        <g>{mileMarkers()}</g>
        {relativePointsArr.map((line, i) => (
          <Polyline
            key={i}
            points={pointsToPathString(line)}
            color={colors[i]}
          />
        ))}
      </StyledSvg>
      <AltitudeOverlay>{altitudeMarkers}</AltitudeOverlay>
    </Container>
  );
};

LineGraph.propTypes = {
  elevations: PropTypes.arrayOf(
    PropTypes.shape({
      distanceFromPreviousPoint: PropTypes.number,
      elevation: PropTypes.number,
      id: PropTypes.number
    })
  ),
  className: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string)
};

const Container = styled("div")`
  margin-top: ${p => p.theme.ss(0.25)};
  position: relative;
  width: 100%;
  line-height: 0;
  padding: 0 ${p => p.theme.ss(1)};
  box-sizing: border-box;
`;

const getTransform = x => {
  if (x > 80) return "-70%";
  if (x < 20) return "-30%";
  return "-50%";
};

const getTipPosition = x => {
  if (x > 80) return "70%";
  if (x < 20) return "30%";
  return "50%";
};

const ElevationMarker = styled("div")`
  ${flexCenter};
  background-color: ${p => p.theme.brandColor};
  padding: 0 1.25em;
  font-size: ${p => p.theme.ts(0.5)};
  font-weight: 700;
  position: absolute;
  left: ${p => p.x}%;
  top: ${p => p.y}%;
  transform: translate(${p => getTransform(p.x)}, 35%);
  border-radius: 1.5em;
  min-width: 25px;
  color: #fff;
  height: 1.75em;
  border: 2px solid #fff;

  &:after {
    display: block;
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${p => p.theme.brandColor};
    position: absolute;
    left: ${p => getTipPosition(p.x)};
    top: 100%;
    transform: translate(-50%, -10%);
  }
`;

const AltitudeOverlay = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 2em);
  height: 100%;
  margin: 0 ${p => p.theme.ss(1)};
`;

const Polyline = styled("polyline")`
  fill: ${p => p.color};
  stroke: ${p => p.color};
  stroke-width: 1px;
`;

const Marker = styled("text")`
  font-size: 7px;
  fill: ${p => p.theme.gray4};
  font-weight: 600;
`;

const StyledRect = styled("rect")`
  fill: ${p => (p.shouldFill ? p.theme.gray3 : "transparent")};
`;

const StyledSvg = styled("svg")`
  width: 100%;
`;

export default LineGraph;
