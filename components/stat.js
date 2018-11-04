import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Label from "./label";

const Stat = ({ total, label, unit, icon, className }) => (
  <Container className={className}>
    {icon}
    <Total>
      {total}
      {unit && <Unit>{unit}</Unit>}
    </Total>
    <StyledLabel>{label}</StyledLabel>
  </Container>
);

Stat.propTypes = {
  icon: PropTypes.element,
  total: PropTypes.node,
  label: PropTypes.string,
  unit: PropTypes.string,
  className: PropTypes.string
};

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Total = styled("div")`
  font-size: ${p => p.theme.ts(1.5)};
  font-weight: 700;
  dislay: flex;
  align-items: top;
`;

const Unit = styled("sup")`
  font-size: ${p => p.theme.ts(0.33)};
`;

const StyledLabel = styled(Label)`
  font-size: ${p => p.theme.ts(0.66)};
  line-height: 1.4;
  color: inherit;
`;

export default Stat;
