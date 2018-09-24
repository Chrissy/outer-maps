import React from "react";
import theme from "../styles/theme";
import { ThemeProvider } from "emotion-theming";
import DifficultyChart from "../components/difficultyChart.js";
import renderer from "react-test-renderer";

it("renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <DifficultyChart score={80} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
