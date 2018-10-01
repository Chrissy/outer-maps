import React from "react";
import PropTypes from "prop-types";
import theme from "../styles/theme";
import styled from "react-emotion";
import camelCase from "lodash.camelcase";
import { flexCenter } from "../styles/flex";
import Label from "./label";

const DifficultyChart = ({ score, className }) => {
  const rotation = () => {
    return (score > 50 ? 225 : 45) + ((score - 50) / 100) * 360;
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
    <Container className={className}>
      <Circle difficulty={difficultyCamelCase} halfEmpty={score < 50} />
      <Circle
        difficulty={difficultyCamelCase}
        rotation={rotation()}
        halfEmpty={score < 50}
      />
      <InnerCircle>
        <Data>
          <StyledLabel>Difficulty</StyledLabel>
          <Score difficulty={difficultyCamelCase}>{score}</Score>
          <Difficulty difficulty={difficultyCamelCase}>
            {difficultyHumanName}
          </Difficulty>
        </Data>
      </InnerCircle>
    </Container>
  );
};

DifficultyChart.propTypes = {
  score: PropTypes.number,
  className: PropTypes.string
};

const borderWidth = "6px";

const getColor = difficulty => {
  return difficulty ? theme.difficulties[difficulty] : theme.accentColor;
};

const Container = styled("div")`
  ${flexCenter};
  width: 130px;
  height: 130px;
  font-size: ${p => p.theme.ts(0.75)};
  background: ${p => p.theme.gray6};
  position: relative;
  border-radius: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    width: 125px;
    height: 125px;
    font-size: 0.7em;
  }
`;

const Circle = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-width: ${borderWidth};
  border-style: solid;
  border-color: transparent transparent ${p => getColor(p.difficulty)}
    ${p => getColor(p.difficulty)};
  transform: rotate(${p => (p.halfEmpty ? "45deg" : "225deg")});
  transform: ${p => p.rotation && `rotate(${p.rotation}deg)`};
  border-radius: 100%;
`;

const InnerCircle = styled("div")`
  width: calc(100% - calc(${borderWidth} * 2));
  height: calc(100% - calc(${borderWidth} * 2));
  background: ${p => p.theme.gray1};
  border-radius: 100%;
  ${flexCenter};
`;

const Data = styled("div")`
  margin-top: -${p => p.theme.ss(0.5)};
  height: 50%;
  text-align: center;
  display: grid;
  grid-template-rows: 1em 1fr 1.25em;
`;

const StyledLabel = styled(Label)`
  line-height: 0;
  align-self: flex-start;
`;

const Score = styled("div")`
  font-size: ${p => p.theme.ts(3.5)};
  color: ${p => getColor(p.difficulty)};
  line-height: 0;
  align-self: center;
  font-weight: 700;
  line-height: 0;
`;

const Difficulty = styled("div")`
  color: ${p => getColor(p.difficulty)};
  align-self: flex-end;
  font-weight: 500;
  text-transform: uppercase;
  font-size: ${p => p.theme.ts(0.875)};
  line-height: 0;
`;

export default DifficultyChart;
