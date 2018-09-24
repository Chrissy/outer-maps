import React from "react";
import PropTypes from "prop-types";
import theme from "../styles/theme";
import styled from "react-emotion";
import camelCase from "lodash.camelCase";
import { flexCenter } from "../styles/flex";
import Label from "./label";

const DifficultyChart = ({ score }) => {
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
    <Container>
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
  score: PropTypes.number
};

const borderWidth = "6px";

const getColor = difficulty => {
  return difficulty ? theme.difficulties[difficulty] : theme.accentColor;
};

const Container = styled("div")`
  width: 130px;
  height: 130px;
  font-size: ${p => p.theme.ts(2)};
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
  transform: rotate(${p => (p.theme.halfEmpty ? "45deg" : "225deg")});
  transform: ${p => p.rotation && `rotate(${p.rotation})`};
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
  margin-top: -${p => p.theme.ss(3)};
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
  font-size: ${p => p.theme.ts(15)};
  color: ${p => getColor(p.difficulty)};
  line-height: 0;
  align-self: center;
  font-weight: 700;
`;

const Difficulty = styled("div")`
  color: ${p => getColor(p.difficulty)};
  align-self: flex-end;
  font-weight: 500;
  text-transform: uppercase;
  font-size: ${p => p.theme.ts(3)};
`;

export default DifficultyChart;
