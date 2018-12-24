import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "react-emotion";
import Svg from "./svg";
import numberShortener from "../modules/numberShortener";
import { metersToMiles } from "../modules/conversions";

const TrailControl = ({
  activeTrail,
  previewElement,
  activeHandle,
  onCutClick,
  onCutCancel,
  onCutFinish,
  onReverseClick,
  onBothWaysClick,
  onRemoveClick
}) => {
  if (previewElement) {
    const { name, distance, area } = previewElement;

    return (
      <TrailControlContainer>
        <TrailControlElement first>{name}</TrailControlElement>
        {distance && (
          <TrailControlElement units>
            {numberShortener({
              number: metersToMiles(distance)
            })}{" "}
            miles
          </TrailControlElement>
        )}
        {area && (
          <TrailControlElement units>
            {numberShortener({
              number: metersToMiles(area)
            })}{" "}
            miles<sup>2</sup>
          </TrailControlElement>
        )}
      </TrailControlContainer>
    );
  } else if (activeTrail) {
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
  } else {
    return null;
  }
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

const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(5%);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const TrailControlContainer = styled("div")`
  animation: 0.2s ${slideUp} cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
  align-items: ${p => (p.units ? "flex-start" : "center")};
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
