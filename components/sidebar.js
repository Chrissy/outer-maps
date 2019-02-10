import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import GeoViewport from "@mapbox/geo-viewport";
import bbox from "@turf/bbox";
import TrailSidebar from "./trailSidebar";
import BoundarySidebar from "./boundarySidebar";
import Terrain from "./terrain";
import { pointsToFeatureCollection } from "../modules/stateToGeoJson";
import sliceElevationsWithHandles from "../modules/sliceElevationsWithHandles";

const Sidebar = ({ trails, boundary, handles, ...props }) => {
  const slicedTrails = () => {
    return trails.map(t => sliceElevationsWithHandles(t, handles));
  };

  const reverseTrails = trails => {
    return trails.map(
      trail =>
        trail.reversed
          ? {
            ...trail,
            points: [...trail.points.reverse()]
          }
          : trail
    );
  };

  const trailOrBoundary = () => {
    if (trails && trails.length)
      return (
        <TrailSidebar
          firstTrail={reverseTrails(slicedTrails())[0]}
          trails={reverseTrails(slicedTrails())}
          handles={handles}
          terrain={getTerrain()}
        />
      );
    if (boundary && boundary.selected)
      return <BoundarySidebar terrain={getTerrain()} {...boundary} />;
  };

  const getTerrain = () => {
    if (trails && trails.length) {
      const pointsArr = slicedTrails().map(p => p.points || []);
      const points = pointsArr.reduce((a, r) => [...a, ...r], []);
      if (!points.length) return null;
      const { center, zoom } = GeoViewport.viewport(
        bbox(pointsToFeatureCollection(points)),
        [1024, 800]
      );
      return (
        <StyledTerrain points={pointsArr} paths zoom={zoom} center={center} />
      );
    } else if (boundary && boundary.selected && boundary.bounds) {
      const { center, zoom } = GeoViewport.viewport(boundary.bounds, [
        1024,
        1024
      ]);
      return <StyledTerrain shape zoom={zoom} center={center} />;
    }
  };

  const hasContent = () =>
    (boundary && boundary.selected) || (trails && trails.some(t => t.selected));

  return (
    <Container active={hasContent()} {...props}>
      <Content>{trailOrBoundary()}</Content>
    </Container>
  );
};

Sidebar.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array
};

const Container = styled("div")`
  font-family: ${p => p.theme.bodyFont};
  position: absolute;
  height: 100%;
  width: 43vw;
  min-width: 400px;
  max-width: 500px;
  background: ${p => p.theme.gray2};
  color: ${p => p.theme.gray7};
  border-right: 1px solid ${p => p.theme.gray4};
  box-sizing: border-box;
  transition: 0.3s all;
  opacity: ${p => (p.active || p.hidden ? 1 : 0)};
  transform: translateX(${p => (p.active ? 0 : p.theme.ss(1))});
  z-index: ${p => (p.active ? 2 : -1)};
  overflow: scroll;
  top: 0;

  @media (max-width: 600px) {
    height: 85vh;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    top: auto;
    transform: translateY(${p => p.theme.ss(1)});
  }
`;

const Content = styled("div")`
  font-size: ${p => p.theme.ts(1.125)};
  line-height: ${p => p.theme.ts(1.5)};
  transition: 0.2s all;
  position: relative;
`;

const StyledTerrain = styled(Terrain)`
  display: ${p => (p.visible ? "block" : "none")};
`;

export default Sidebar;
