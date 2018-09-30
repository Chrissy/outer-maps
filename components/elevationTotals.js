import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import LineGraph from "./lineGraph";
import Stat from "./stat";
import DifficultyChart from "./difficultyChart";
import Hiker from "../svg/hiker.svg";
import Up from "../svg/up.svg";
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
        <Stat icon={Hiker} label="Miles" total={miles()} />
        <Stat
          icon={Up}
          label="Elevation Gain"
          border={true}
          short={true}
          total={`+${new Intl.NumberFormat().format(
            metersToFeet(elevationGain())
          )}`}
        />
        <Stat
          icon={FlippedUp}
          label="Elevation Loss"
          short={true}
          total={`-${new Intl.NumberFormat().format(
            metersToFeet(elevationLoss())
          )}`}
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

const FlippedUp = styled(Up)`
  transform: rotate(180deg);
`;

export default ElevationTotals;
