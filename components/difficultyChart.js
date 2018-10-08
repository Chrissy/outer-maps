import React from "react";
import PropTypes from "prop-types";
import partialCircle from "svg-partial-circle";
import theme from "../styles/theme";
import styled from "react-emotion";
import camelCase from "lodash.camelcase";

const RADIUS = 50;
const STROKE_WIDTH = 5;

const DifficultyChart = ({ score, className }) => {
  const totalWidth = RADIUS + STROKE_WIDTH / 2;

  const pathString = percent => {
    return partialCircle(
      totalWidth,
      totalWidth,
      RADIUS,
      0,
      Math.min(Math.max(percent, 1), 99.99) * 0.062831853071796
    )
      .map(command => command.join(" "))
      .join(" ");
  };

  const difficulty = () => {
    if (score < 25) return "Very Easy";
    if (score < 50) return "Easy";
    if (score < 75) return "Moderate";
    if (score < 96) return "Strenuous";
    if (score >= 96) return "Extreme";
  };

  const difficultyHumanName = difficulty();
  const difficultyCamelCase = camelCase(difficultyHumanName);

  return (
    <StyledSvg
      className={className}
      viewBox={`0 0 ${totalWidth * 2} ${totalWidth * 2}`}
    >
      <Circle
        cx={totalWidth}
        cy={totalWidth}
        r={RADIUS}
        score={score}
        difficulty={difficultyCamelCase}
      />
      <CircleFill
        d={pathString(score)}
        difficulty={difficultyCamelCase}
        score={score}
        transform={`rotate(-90 ${totalWidth} ${totalWidth})`}
      />
      <StyledLabel
        x="50%"
        y="25%"
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        Difficulty
      </StyledLabel>
      <Score
        x="50%"
        y="52%"
        alignmentBaseline="middle"
        textAnchor="middle"
        difficulty={difficultyCamelCase}
      >
        {score}
      </Score>
      <Difficulty
        difficulty={difficultyCamelCase}
        x="50%"
        y="74%"
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {difficultyHumanName}
      </Difficulty>
    </StyledSvg>
  );
};

DifficultyChart.propTypes = {
  score: PropTypes.number,
  className: PropTypes.string
};

const getColor = difficulty => {
  return difficulty ? theme.difficulties[difficulty] : theme.accentColor;
};

const Circle = styled("circle")`
  stroke: ${p => p.theme.gray4};
  stroke: ${p => (p.score < 50 ? getColor(p.difficulty) : p.theme.gray4)};
  stroke-width: ${STROKE_WIDTH};
  fill: #fff;
`;

const CircleFill = styled("path")`
  stroke: ${p => (p.score < 50 ? p.theme.gray4 : getColor(p.difficulty))};
  stroke-width: ${STROKE_WIDTH};
  fill: none;
`;

const StyledSvg = styled("svg")`
  width: 100%;
  height: 100%;
`;

const StyledLabel = styled("text")`
  font-size: 7pt;
  fill: ${p => p.theme.gray6};
`;

const Score = styled("text")`
  font-size: 32pt;
  fill: ${p => getColor(p.difficulty)};
  font-weight: 700;
  line-height: 0;
`;

const Difficulty = styled("text")`
  fill: ${p => getColor(p.difficulty)};
  font-weight: 600;
  font-size: 10pt;
  line-height: 0;
`;

export default DifficultyChart;
