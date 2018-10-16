import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Svg from "./svg";

const TrailTypes = ({ hike, bike, ohv, horse }) => {
  const total = () => hike + bike + ohv + horse;

  const percent = number => Math.round((number / total()) * 100) + "%";

  return (
    <React.Fragment>
      <CombinedPercentBar>
        <PercentBar index={0} percent={percent(hike)} />
        <PercentBar index={1} percent={percent(horse)} />
        <PercentBar index={2} percent={percent(bike)} />
        <PercentBar index={3} percent={percent(ohv)} />
      </CombinedPercentBar>
      <Container>
        <Type index={0}>
          <StyledSvg src="transportation-hike" index={0} />
          {percent(hike)} Hike
        </Type>
        <Type index={1}>
          <StyledSvg src="transportation-horse" index={0} />
          {percent(horse)} Horse
        </Type>
        <Type index={2}>
          <StyledSvg src="transportation-bike" index={0} />
          {percent(bike)} Bike
        </Type>
        <Type index={3}>
          <StyledSvg src="transportation-ohv" index={0} />
          {percent(ohv)} OHV
        </Type>
      </Container>
    </React.Fragment>
  );
};

TrailTypes.propTypes = {
  hike: PropTypes.number,
  bike: PropTypes.number,
  ohv: PropTypes.number,
  horse: PropTypes.number
};

const Container = styled("div")`
  display: grid;
  grid-template-columns: 0.5fr 0.5fr;
  grid-column-gap: ${p => p.theme.ss(1)};
  grid-row-gap: ${p => p.theme.ss(0.25)};
`;

const CombinedPercentBar = styled("div")`
  height: ${p => p.theme.ss(0.75)};
  display: flex;
  margin-bottom: ${p => p.theme.ss(1)};
`;

const getColor = (p, i) => {
  switch (i % 4) {
  case 0:
    return p.theme.brandColor;
  case 1:
    return p.theme.blue;
  case 2:
    return p.theme.accentColorTintLight;
  case 3:
    return p.theme.accentColor;
  }
};

const PercentBar = styled("div")`
  height: 100%;
  width: ${p => p.percent || "100%"};
  background-color: ${p => getColor(p, p.index)};
`;

const Type = styled("div")`
  display: flex;
  font-size: ${p => p.theme.ts(0.75)};
  color: ${p => getColor(p, p.index)};
`;

const StyledSvg = styled(Svg)`
  height: auto;
  width: 1.8em;
  height: 1.8em;
  margin: 0 ${p => p.theme.ss(0.25)} 1em ${p => p.theme.ss(0.25)};
`;

export default TrailTypes;
