import React from "react";
import ImportantWeather from "../components/importantWeather.js";
import renderer from "react-test-renderer";
import { ThemeProvider } from "emotion-theming";
import theme from "../styles/theme";

const props = {
  maxTemperature: 100,
  minTemperature: 0,
  chanceOfPercipitation: 12
};

it("renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <ImportantWeather {...props} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
