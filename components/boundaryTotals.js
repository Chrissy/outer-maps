import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import numberShortener from "../modules/numberShortener";
import { metersToFeet, metersToMiles } from "../modules/conversions";
import Stat from "./stat";
import Svg from "./svg";

const BoundaryTotals = ({ area, trailsCount, highPoint }) => {
  return (
    <Container>
      <StyledStat
        icon={<Icon src="area" />}
        label="Miles²"
        total={numberShortener({
          number: metersToMiles(area),
          oneDecimal: true
        })}
      />
      <StyledStat
        icon={<Icon src="path" />}
        label="Trails"
        border={true}
        tall={true}
        total={numberShortener({ number: trailsCount })}
      />
      <StyledStat
        icon={<Icon src="elevation" />}
        label="High Point"
        total={numberShortener({ number: parseInt(metersToFeet(highPoint)) })}
      />
    </Container>
  );
};

BoundaryTotals.propTypes = {
  area: PropTypes.number,
  trailsCount: PropTypes.number,
  highPoint: PropTypes.number
};

const Container = styled("div")`
  display: grid;
  grid-template-columns: 0.33fr 0.33fr 0.33fr;
  grid-area: totals;
`;

const StyledStat = styled(Stat)`
  color: #fff;
  border-color: ${p => p.theme.gray7};
  border-width: ${p => (p.border ? "0 1px" : 0)};
  margin: ${p => p.theme.ss(0.5)} 0;
  border-style: solid;
  height: 4.5em;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
`;

const Icon = styled(Svg)`
  height: 1em;
  width: 1em;
`;

export default BoundaryTotals;
