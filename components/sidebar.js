import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import TrailSidebar from "./trailSidebar";
import BoundarySidebar from "./boundarySidebar";
import Terrain from "./terrain";
import sliceElevationsWithHandles from "../modules/sliceElevationsWithHandles";

const Sidebar = ({ trails, boundary, handles, ...props }) => {
  const slicedTrails = () => {
    return trails.map(t => sliceElevationsWithHandles(t, handles));
  };

  const trailOrBoundary = () => {
    if (trails && trails.length)
      return (
        <TrailSidebar
          firstTrail={slicedTrails()[0]}
          trails={slicedTrails()}
          handles={handles}
          terrain={getTerrain()}
        />
      );
    if (boundary && boundary.selected)
      return <BoundarySidebar terrain={getTerrain()} {...boundary} />;
  };

  const getTerrain = () => (
    <StyledTerrain
      satelliteImageUrl={(trails[0] || boundary || {}).satelliteImageUrl}
      points={(slicedTrails()[0] || {}).points}
      zoom={(trails[0] || boundary || {}).satelliteZoom}
      center={(trails[0] || boundary || {}).satelliteCenter}
    />
  );

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
  min-width: 320px;
  max-width: 500px;
  background: ${p => p.theme.gray1};
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
    height: 75vh;
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
