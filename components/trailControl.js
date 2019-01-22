import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "react-emotion";
import Svg from "./svg";
import numberShortener from "../modules/numberShortener";
import { metersToMiles } from "../modules/conversions";

class TrailControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewTransitioningElement: null
    };

    this.container = React.createRef();
  }

  previewControl(previewElement) {
    const { name, distance, area } = previewElement;

    return (
      <TrailControlContainer
        onAnimationEnd={() => this.onAnimationEnd()}
        previewTransitioningElement={!!this.state.previewTransitioningElement}
      >
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
  }

  activeControl() {
    const {
      activeTrail,
      activeHandle,
      onCutClick,
      onCutCancel,
      onCutFinish,
      onReverseClick,
      onBothWaysClick,
      onRemoveClick
    } = this.props;

    const { uniqueId, name } = activeTrail;

    return (
      <TrailControlContainer
        onAnimationEnd={() => this.onAnimationEnd()}
        previewTransitioningElement={!!this.state.previewTransitioningElement}
        index={uniqueId}
      >
        {activeHandle ? (
          <React.Fragment>
            <TrailControlElement noBorder first>
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
            <TrailControlElement noBorder first>
              {name}
            </TrailControlElement>
            <TrailControlButton onClick={() => onCutClick(uniqueId)}>
              <Icon src="scissors" />
            </TrailControlButton>
            <TrailControlButton onClick={() => onReverseClick(uniqueId)}>
              <Reverse src="flip" />
            </TrailControlButton>
            <TrailControlButton onClick={() => onBothWaysClick(activeTrail)}>
              <Icon src="2x" />
            </TrailControlButton>
            <TrailControlButton last onClick={() => onRemoveClick(uniqueId)}>
              <Trash src="trash" />
            </TrailControlButton>
          </React.Fragment>
        )}
      </TrailControlContainer>
    );
  }

  onAnimationEnd() {
    this.setState({ previewTransitioningElement: null });
  }

  /* todo: make this "safe" */
  UNSAFE_componentWillUpdate(futureProps) {
    if (!futureProps.previewElement && this.props.previewElement) {
      this.setState({ previewTransitioningElement: this.props.previewElement });
    }
  }

  render() {
    const { activeTrail } = this.props;
    const previewElement =
      this.props.previewElement || this.state.previewTransitioningElement;

    return (
      <React.Fragment>
        {activeTrail && !previewElement && this.activeControl()}
        {previewElement && this.previewControl(previewElement)}
      </React.Fragment>
    );
  }
}

TrailControl.propTypes = {
  activeTrail: PropTypes.object,
  activeHandle: PropTypes.object,
  previewElement: PropTypes.object,
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
  animation-direction: ${p =>
    p.previewTransitioningElement ? "reverse" : "normal"};
  position: absolute;
  top: ${p => p.theme.ss(1)};
  right: ${p => p.theme.ss(4)};
  background: ${p =>
    p.index ? p.theme.trailColor(p.index - 1) : "rgba(0, 0, 0, 0.8)"};
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
  border-left: ${p => (p.noBorder ? 0 : "1px")} solid rgba(255, 255, 255, 0.2);
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
