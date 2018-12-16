import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Svg from "./svg";

const TrailControl = ({
  activeTrail,
  activeHandle,
  onCutClick,
  onCutCancel,
  onCutFinish,
  onReverseClick,
  onBothWaysClick,
  onRemoveClick
}) => {
  if (!activeTrail) return null;
  const { uniqueId } = activeTrail;

  return (
    <TrailControlContainer>
      {activeHandle ? (
        <React.Fragment>
          <TrailControlElement helper noBorder first>
            <Icon src="scissors" />
            Slicing
          </TrailControlElement>
          <TrailControlButton onClick={() => onCutFinish(uniqueId)}>
            Finish
          </TrailControlButton>
          <TrailControlButton last onClick={() => onCutCancel(uniqueId)}>
            Cancel
          </TrailControlButton>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <TrailControlButton
            first
            noBorder
            onClick={() => onCutClick(uniqueId)}
          >
            <Icon src="scissors" /> Slice
          </TrailControlButton>
          <TrailControlButton onClick={() => onReverseClick(uniqueId)}>
            <Reverse src="flip" /> Reverse
          </TrailControlButton>
          <TrailControlButton onClick={() => onBothWaysClick(activeTrail)}>
            <Icon src="2x" /> Both Ways
          </TrailControlButton>
          <TrailControlButton last onClick={() => onRemoveClick(uniqueId)}>
            <Trash src="trash" /> Remove
          </TrailControlButton>
        </React.Fragment>
      )}
    </TrailControlContainer>
  );
};

TrailControl.propTypes = {
  activeTrail: PropTypes.object,
  activeHandle: PropTypes.object,
  onCutClick: PropTypes.func,
  onCutCancel: PropTypes.func,
  onCutFinish: PropTypes.func,
  onReverseClick: PropTypes.func,
  onBothWaysClick: PropTypes.func,
  onRemoveClick: PropTypes.func
};

const borderRadius = "30px";

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

const TrailControlElement = styled("div")`
  padding: 0.33em 1em 0.5em 1em;
  font-style: ${p => (p.helper ? "italic" : "normal")};
  border-left: ${p => (p.noBorder ? 0 : "1px")} solid ${p => p.theme.gray7};
  display: flex;
  background: ${p => (p.helper ? p.theme.gray7 : null)};
  color: ${p => p.theme.gray1};
  align-items: center;
  border-radius: ${p => (p.first ? borderRadius : 0)}
    ${p => (p.last ? borderRadius : 0)} ${p => (p.last ? borderRadius : 0)}
    ${p => (p.first ? borderRadius : 0)};
`;

const TrailControlButton = styled(TrailControlElement)`
  cursor: pointer;
  &:hover {
    color: $fff;
    background: ${p => p.theme.gray7};
  }
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
