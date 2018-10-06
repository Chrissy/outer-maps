import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import numberShortener from "../modules/numberShortener";
import { metersToFeet, metersToMiles } from "../modules/conversions";
import Stat from "./stat";
import Mountain from "../svg/mountain.svg";
import Path from "../svg/path.svg";
import Squares from "../svg/squares.svg";

const BoundaryTotals = ({ area, trailsCount, highPoint }) => {
  return (
    <Container>
      <StyledStat
        icon={Squares}
        label="Miles²"
        total={numberShortener({
          number: metersToMiles(area),
          oneDecimal: true
        })}
      />
      <StyledStat
        icon={Path}
        label="Trails"
        border={true}
        tall={true}
        total={numberShortener({ number: trailsCount })}
      />
      <StyledStat
        icon={Mountain}
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
  padding: 0;
  margin: ${p => p.theme.ss(0.5)} 0;
  border-style: solid;
  height: 4.5em;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
`;

export default BoundaryTotals;
