import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Label from "./label";

const HorizontalBarGraph = ({ keys, values }) => {
  const toPercentageWidth = value =>
    Math.round((value / Math.max(...values)) * 100) + "%";

  const pairsToGraph = () => {
    return values.filter(value => value).map((value, i) => (
      <Bar key={keys[i]}>
        <Fill index={i} style={{ width: toPercentageWidth(value) }} />
        <StyledLabel index={i}>{keys[i]}</StyledLabel>
      </Bar>
    ));
  };

  return <div>{pairsToGraph()}</div>;
};

HorizontalBarGraph.propTypes = {
  keys: PropTypes.array,
  values: PropTypes.array
};

const getColor = ({ theme, index }) => {
  return [theme.purple, theme.orange, theme.accentColor, theme.red][index % 5];
};

const Bar = styled("div")`
  display: grid;
  grid-template-columns: 1fr 2em;
  grid-template-rows: 1.1em;
  align-items: center;
`;

const Fill = styled("div")`
  width: 100%;
  height: 65%;
  background-color: ${p => getColor(p)};
`;

const StyledLabel = styled(Label)`
  font-size: ${p => p.theme.ts(0.75)};
  text-align: right;
  color: ${p => getColor(p)};
`;

export default HorizontalBarGraph;
