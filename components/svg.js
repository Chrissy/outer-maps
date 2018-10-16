import PropTypes from "prop-types";
import React from "react";
import styled from "react-emotion";

const Svg = ({ src, size, width, height, ...props }) => {
  const file = require(`../svg/${src}.svg`).default;
  if (!file) return null;
  const { id, viewBox } = file;

  return (
    <StyledSvg
      {...props}
      viewBox={viewBox}
      width={width || size || "1em"}
      height={height || size || "1em"}
    >
      <use href={`#${id}`} xlinkHref={`#${id}`} />
    </StyledSvg>
  );
};

Svg.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
};

const StyledSvg = styled("svg")`
  vertical-align: middle;
`;

export default Svg;
