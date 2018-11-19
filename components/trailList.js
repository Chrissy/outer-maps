import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Svg from "./svg";
import { flexCenter, flexHorizontalCenter } from "../styles/flex";

const TrailList = ({ trails, unselectTrail }) => {
  const listElement = (trail, i) => {
    return (
      <ListElement key={trail.uniqueId} i={i}>
        <Name>{trail.name}</Name>
        <CloseContainer onClick={() => unselectTrail(trail.id)}>
          <StyledClose src="exit" />
        </CloseContainer>
      </ListElement>
    );
  };

  return <Container>{trails.map((t, i) => listElement(t, i))}</Container>;
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
  margin-top: ${p => p.theme.ss(0.5)};
  padding: 0 ${p => p.theme.ss(0.5)};
  ${flexHorizontalCenter};
  flex-wrap: wrap;
`;

const ListElement = styled("li")`
  ${flexHorizontalCenter};
  border-radius: 0.5em;
  background-color: ${p =>
    p.theme.trailColors[p.i % p.theme.trailColors.length]};
  box-sizing: border-box;
  color: #fff;
  font-size: ${p => p.theme.ts(0.75)};
  font-weight: 600;
  padding-left: ${p => p.theme.ss(0.75)};
  margin-right: ${p => p.theme.ss(0.75)};
  margin-bottom: ${p => p.theme.ss(0.5)};
  height: 2em;
`;

const Name = styled("div")`
  margin-bottom: 0.1em;
`;

const CloseContainer = styled("div")`
  width: 1.5em;
  padding-right: ${p => p.theme.ss(0.5)};
  height: 100%;
  ${flexCenter};
  cursor: pointer;
`;

const StyledClose = styled(Svg)`
  width: 0.66em;
  height: 0.66em;
  color: ${p => p.theme.accentColorTintLighter};
`;

export default TrailList;
