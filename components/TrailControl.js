import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Svg from "./svg";

const TrailControl = ({
  activeTrail,
  onCutClick,
  onFlipClick,
  onBothWaysClick,
  onRemoveClick
}) => {
  return activeTrail ? (
    <TrailControlContainer>
      {activeTrail.name}
      <Svg src="scissors" onClick={onCutClick} />
      <Svg src="flip" onClick={onFlipClick} />
      <Svg src="2x" onClick={onBothWaysClick} />
      <Svg src="trash" onClick={onRemoveClick} />
    </TrailControlContainer>
  ) : null;
};

TrailControl.propTypes = {
  activeTrail: PropTypes.object,
  onCutClick: PropTypes.func,
  onFlipClick: PropTypes.func,
  onBothWaysClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

const TrailControlContainer = styled("div")`
  padding: ${p => p.theme.ss(1)};
  position: absolute;
  top: ${p => p.theme.ss(1)};
  right: ${p => p.theme.ss(3)};
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1;
  color: #fff;
  font-weight: bold;
`;

export default TrailControl;
