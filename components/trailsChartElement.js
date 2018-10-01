import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { metersToMiles } from "../modules/conversions";
import numberShortener from "../modules/numberShortener";

const TrailsChartElement = ({ name, distance }) => {
  const formatDistance = distance =>
    numberShortener({ number: metersToMiles(distance), oneDecimal: true });

  return (
    <Container>
      <Name>{name}</Name>
      <Distance>{formatDistance(distance)}</Distance>
    </Container>
  );
};

TrailsChartElement.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  distance: PropTypes.number,
  id: PropTypes.number
};

const Container = styled("div")`
  display: grid;
  grid-template-columns: 1fr 3em;
  font-size: 0.8em;
  line-height: 1.1em;
  cursor: pointer;

  &:nth-of-type(even) {
    background-color: ${p => p.theme.gray3};
  }
`;

const Name = styled("div")`
  padding: ${p => p.theme.ss(0.5)};
  color: ${p => p.theme.gray7};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Distance = styled("div")`
  padding: ${p => p.theme.ss(0.5)};
  color: ${p => p.theme.gray5};
  border-left: 1px solid #fff;
  text-align: center;
`;

export default TrailsChartElement;
