import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import LineGraph from "./lineGraph";
import Stat from "./stat";
import DifficultyChart from "./difficultyChart";
import Svg from "./svg";
import numberShortener from "../modules/numberShortener";
import { metersToFeet, metersToMiles } from "../modules/conversions";

const ElevationTotals = ({ elevations }) => {
  const elevationGain = () => {
    return elevations.reduce((a, e) => a + e.elevationGain, 0);
  };

  const elevationLoss = () => {
    return elevations.reduce((a, e) => a + e.elevationLoss, 0);
  };

  const distance = () => {
    return elevations.reduce((a, e) => a + e.distanceFromPreviousPoint, 0);
  };

  const miles = () => {
    return metersToMiles(distance());
  };

  const score = () => {
    return Math.min(
      100,
      parseInt(metersToFeet(elevationGain()) / 100 + (miles() / 14) * 50)
    );
  };

  return (
    <Container>
      <Columns>
        <StyledDifficultyChart score={score()} />
        <StyledStat
          icon={<Icon src="elevation" />}
          label="Elevation Gain"
          unit="ft"
          total={`+${numberShortener({
            number: metersToFeet(elevationGain()),
            oneDecimal: true
          })}`}
        />
        <StyledStat
          icon={<Icon src="arrow" />}
          label="Elevation Loss"
          unit="ft"
          border={true}
          borderBottomOnSmall={true}
          total={`-${numberShortener({
            number: metersToFeet(elevationLoss()),
            oneDecimal: true
          })}`}
        />
        <StyledStat
          icon={<MeasureIcon src="distance" />}
          label="Miles"
          borderBottomOnSmall={true}
          total={numberShortener({
            number: miles()
          })}
        />
      </Columns>
      <LineGraph elevations={elevations} />
    </Container>
  );
};

ElevationTotals.propTypes = {
  elevations: PropTypes.array
};

const Container = styled("div")`
  margin-bottom: ${p => p.theme.ss(0.5)};
`;

const Columns = styled("div")`
  display: grid;
  grid-template-columns: 30% 0.35fr 0.35fr 0.29fr;
  align-items: center;

  @media (max-width: 950px) {
    grid-template-columns: 0.29fr 0.26fr 0.26fr 0.19fr;
    font-size: 0.875em;
  }

  @media (max-width: 350px) {
    font-size: 0.75em;
  }
`;

const StyledDifficultyChart = styled(DifficultyChart)`
  width: 140%;
  height: 140%;
  position: relative;
  z-index: 1;
  transform: translate(-10%, -7.5%);

  @media (max-width: 950px) {
    width: 124%;
    height: 124%;
    transform: translate(-5%, -6%);
  }
`;

const StyledStat = styled(Stat)`
  border-color: ${p => p.theme.gray4};
  border-width: ${p => (p.border ? "0 1px" : 0)};
  margin: ${p => p.theme.ss(1)} 0 ${p => p.theme.ss(0.75)};
  border-style: solid;
  height: 4em;
`;

const Icon = styled(Svg)`
  height: 0.9em;
  width: 0.9em;
`;

const MeasureIcon = styled(Icon)`
  height: 0.7em;
  width: 0.7em;
  transform: rotate(-90deg) scaleY(-1);
`;

export default ElevationTotals;
