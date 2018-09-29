import React from "react";
import TrailTypes from "../components/trailTypes.js";
import renderer from "react-test-renderer";
import theme from "../styles/theme";
import { ThemeProvider } from "emotion-theming";

it("renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <TrailTypes hike={30} bike={30} ohv={0} horse={40} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
