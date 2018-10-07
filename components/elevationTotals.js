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
          icon={<MeasureIcon src="distance" />}
          label="Miles"
          total={numberShortener({
            number: miles()
          })}
        />
        <StyledStat
          icon={<Icon src="elevation" />}
          label="Elevation Gain"
          border={true}
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
          total={`-${numberShortener({
            number: metersToFeet(elevationLoss()),
            oneDecimal: true
          })}`}
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
  padding: 0 ${p => p.theme.ss(1)};
`;

const Columns = styled("div")`
  display: grid;
  grid-template-columns: 120px 0.33fr 0.33fr 0.33fr;

  @media (max-width: 360px) {
    grid-template-columns: 90px 0.33fr 0.33fr 0.33fr;
  }
`;

const StyledDifficultyChart = styled(DifficultyChart)`
  margin-top: -${p => p.theme.ss(2.5)};

  @media (max-width: 360px) {
    margin-left: -${p => p.theme.ss(1)};
  }
`;

const StyledStat = styled(Stat)`
  border-color: ${p => p.theme.gray4};
  border-width: ${p => (p.border ? "0 1px" : 0)};
  margin: ${p => p.theme.ss(0.75)} 0;
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
