import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Label from "./label";

const Stat = ({ icon, total, label, short, tall, border }) => (
  <Container border={border}>
    <Icon Node={icon} short={short} tall={tall} />
    <Total>{total}</Total>
    <StyledLabel>{label}</StyledLabel>
  </Container>
);

Stat.propTypes = {
  icon: PropTypes.func,
  total: PropTypes.node,
  label: PropTypes.string,
  short: PropTypes.bool,
  tall: PropTypes.bool,
  border: PropTypes.bool
};

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${p => p.theme.ss(1)} ${p => p.theme.ss(0.5)}
    ${p => p.theme.ss(0.25)};
  text-align: center;
  color: ${p => p.theme.brandColor};
  border-left: ${p => p.border && `1px solid ${p.theme.gray4}`};
  border-right: ${p => p.border && `1px solid ${p.theme.gray4}`};

  @media (max-width: 900px) {
    font-size: ${p => p.theme.ts(0.75)};
  }
`;

const Icon = styled(({ Node, className }) => <Node className={className} />)`
  height: ${p => (p.short ? "0.8em" : "1.1em")};
  height: ${p => p.tall && "1.3em"};
  width: auto;
  fill: ${p => p.theme.brandColor};
`;

const Total = styled("div")`
  font-size: ${p => p.theme.ts(1.5)};
  font-weight: 800;
  margin-bottom: ${p => p.theme.ss(0.25)};
`;

const StyledLabel = styled(Label)`
  font-size: ${p => p.theme.ss(0.75)};
`;

export default Stat;
