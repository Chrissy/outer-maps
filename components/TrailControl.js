import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Svg from "./svg";

const TrailControl = ({
  activeTrail,
  onCutClick,
  onReverseClick,
  onBothWaysClick,
  onRemoveClick
}) => {
  if (!activeTrail) return null;
  const { uniqueId } = activeTrail;

  return (
    <TrailControlContainer>
      <TrailControlButton noBorder onClick={() => onCutClick(uniqueId)}>
        <Icon src="scissors" /> Slice
      </TrailControlButton>
      <TrailControlButton onClick={() => onReverseClick(uniqueId)}>
        <Reverse src="flip" /> Reverse
      </TrailControlButton>
      <TrailControlButton onClick={() => onBothWaysClick(activeTrail)}>
        <Icon src="2x" /> Both Ways
      </TrailControlButton>
      <TrailControlButton onClick={() => onRemoveClick(uniqueId)}>
        <Trash src="trash" /> Remove
      </TrailControlButton>
    </TrailControlContainer>
  );
};

TrailControl.propTypes = {
  activeTrail: PropTypes.object,
  onCutClick: PropTypes.func,
  onReverseClick: PropTypes.func,
  onBothWaysClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

const TrailControlContainer = styled("div")`
  position: absolute;
  top: ${p => p.theme.ss(1)};
  right: ${p => p.theme.ss(4)};
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1;
  color: #fff;
  display: flex;
  font-size: 0.875em;
  border-radius: 30px;
  border: 3px solid #fff;
`;

const TrailControlButton = styled("a")`
  cursor: pointer;
  padding: 0.33em 1em 0.5em 1em;
  border-left: ${p => (p.noBorder ? 0 : "1px")} solid ${p => p.theme.gray5};
  display: flex;
  align-items: center;
`;

const Icon = styled(Svg)`
  margin-right: ${p => p.theme.ss(0.25)};
  margin-top: ${p => p.theme.ss(0.25)};
`;

const Trash = styled(Icon)`
  width: 9px;
  margin-right: 0.33em;
`;

const Reverse = styled(Icon)`
  margin-right: 0.33em;
  width: 10px;
`;

export default TrailControl;
