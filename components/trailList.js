import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { metersToMiles } from "../modules/conversions";
import Close from "../svg/close.svg";
import { flexHorizontalCenter } from "../styles/flex";

const TrailList = ({ trails, unselectTrail }) => {
  const trailDistance = ({ points, hasElevationData }) => {
    if (!hasElevationData) return "";
    return (
      metersToMiles(
        points.reduce((a, e) => {
          return a + e.distanceFromPreviousPoint;
        }, 0)
      ) + "m"
    );
  };

  const listElement = trail => {
    return (
      <ListElement key={trail.id}>
        <SpacedElement>{trail.name}</SpacedElement>
        <SpacedElement>
          <DataElement>{trailDistance(trail)}</DataElement>
          <StyledClose onClick={() => unselectTrail(trail.id)} />
        </SpacedElement>
      </ListElement>
    );
  };

  return <Container>{trails.map(t => listElement(t))}</Container>;
};

TrailList.propTypes = {
  unselectTrail: PropTypes.func,
  trails: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      hasElevationData: PropTypes.bool,
      id: PropTypes.number,
      points: PropTypes.arrayOf(
        PropTypes.shape({
          distanceFromPreviousPoint: PropTypes.number
        })
      )
    })
  )
};

const Container = styled("div")`
  margin: ${p => p.theme.ss(0.5)} 0 ${p => p.theme.ss(3)} 0;
  padding: 0 ${p => p.theme.ss(1)};
`;

const ListElement = styled("li")`
  ${flexHorizontalCenter} width: 100%;
  border-radius: 0.5em;
  justify-content: space-between;
  background-color: ${p => p.theme.accentColor};
  box-sizing: border-box;
  color: #fff;
  font-size: 0.75em;
  margin-bottom: ${p => p.theme.ss(1)};
  padding: ${p => p.theme.ss(0.5)} ${p => p.theme.ss(0.75)};

  &:nth-of-type(3n + 2) {
    background-color: ${p => p.theme.accentColorTintDark};
  }

  &:nth-of-type(3n + 3) {
    background-color: ${p => p.theme.accentColorTintDarker};
  }
`;

const SpacedElement = styled("div")`
  padding: ${p => p.theme.ss(0.5)} ${p => p.theme.ss(0.75)};
`;

const DataElement = styled("div")`
  border-right: 1px solid ${p => p.theme.accentColorTintLight};
  padding: ${p => p.theme.ss(0.5)} ${p => p.theme.ss(0.75)};
`;

const StyledClose = styled(Close)`
  width: 2.5em;
  height: 0.75em;
  padding: 0 ${p => p.theme.ss(0.5)} 0 ${p => p.theme.ss(0.25)};
  display: block;

  path {
    stroke: #fff;
  }
`;

export default TrailList;
