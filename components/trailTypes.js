import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Hike from "../svg/transportation-hike.svg";
import Bike from "../svg/transportation-bike.svg";
import Ohv from "../svg/transportation-ohv.svg";
import Horse from "../svg/transportation-horse.svg";

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
          <Icon Node={Hike} index={0} />
          {percent(hike)} Hike
        </Type>
        <Type index={1}>
          <Icon Node={Horse} index={1} />
          {percent(horse)} Horse
        </Type>
        <Type index={2}>
          <Icon Node={Bike} index={2} />
          {percent(bike)} Bike
        </Type>
        <Type index={3}>
          <Icon Node={Ohv} index={3} />
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
  case 1:
    return p.theme.accentColorTintDark;
  case 2:
    return p.theme.accentColor;
  case 3:
    return p.theme.accentColorTintLight;
  default:
    return p.theme.accentColorTintDarker;
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

const Icon = styled(({ Node, className }) => <Node className={className} />)`
  height: auto;
  width: 1.8em;
  height: 1.8em;
  margin: 0 ${p => p.theme.ss(0.25)} 1em ${p => p.theme.ss(0.25)};

  path {
    fill: ${p => getColor(p, p.index)};
  }
`;

export default TrailTypes;
