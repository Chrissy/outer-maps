import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Label from "./label";
import { flexCenter } from "../styles/flex";
import HighIcon from "../svg/weather-high.svg";
import LowIcon from "../svg/weather-low.svg";
import PrecipIcon from "../svg/weather-precip.svg";

const ImportantWeather = ({
  maxTemperature,
  minTemperature,
  chanceOfPercipitation
}) => {
  const percentText = integer => {
    return typeof integer == "number" ? parseInt(integer / 10) + "%" : "0%";
  };

  const tempIsExtreme = temp => {
    if (temp > 75) return "hot";
    if (temp < 50) return "cold";
    return null;
  };

  return (
    <React.Fragment>
      <StyledLabel>Average weather this week</StyledLabel>
      <Container>
        <ImportantWeatherUnit>
          <div className={flexCenter}>
            <Icon node={HighIcon} extreme={tempIsExtreme(maxTemperature)} />
            <Data extreme={tempIsExtreme(maxTemperature)}>
              {parseInt(maxTemperature)}°
            </Data>
          </div>
          <StyledLabel>High Temperature</StyledLabel>
        </ImportantWeatherUnit>
        <ImportantWeatherUnit darkBg={true}>
          <div className={flexCenter}>
            <Icon
              node={LowIcon}
              low={true}
              extreme={tempIsExtreme(minTemperature)}
            />
            <Data extreme={tempIsExtreme(minTemperature)}>
              {parseInt(minTemperature)}°
            </Data>
          </div>
          <StyledLabel>Low Temperature</StyledLabel>
        </ImportantWeatherUnit>
        <ImportantWeatherUnit>
          <div className={flexCenter}>
            <Icon node={PrecipIcon} />
            <Data>{percentText(chanceOfPercipitation)}</Data>
          </div>
          <StyledLabel>Chance percipitation</StyledLabel>
        </ImportantWeatherUnit>
      </Container>
    </React.Fragment>
  );
};

ImportantWeather.propTypes = {
  maxTemperature: PropTypes.number,
  minTemperature: PropTypes.number,
  chanceOfPercipitation: PropTypes.number
};

const Container = styled("div")`
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
`;

const ImportantWeatherUnit = styled("div")`
  display: grid;
  grid-template-rows: auto 0.6em;
  justify-items: center;
  align-items: center;
  padding: ${p => p.theme.ss(0.5)};
  padding-bottom: ${p => p.theme.ss(1)};
  color: ${p => p.theme.gray6};
  background: ${p => p.darkBg && p.theme.gray3};

  @media (max-width: 900px) {
    font-size: ${p => p.theme.ts(0.875)};
  }
`;

const getColor = p => {
  if (p.hot) return p.theme.accentColor;
  if (p.cold) return p.theme.purple;
  return p.theme.gray6;
};

const Icon = styled(({ node, ...props }) => <node {...props} />)`
  width: ${p => (p.low ? p.theme.ss(2.5) : p.theme.ss(5))};
  height: auto;
  margin-top: ${p => p.theme.ss(0.5)};
  margin-right: ${p => p.theme.ss(0.25)};

  path {
    fill: ${p => getColor(p)};
  }
`;

const Data = styled("div")`
  font-size: ${p => p.theme.ts(2.5)};
  color: ${p => getColor(p)};
  font-weight: 500;
`;

const StyledLabel = styled(Label)`
  text-align: center;
`;

export default ImportantWeather;
