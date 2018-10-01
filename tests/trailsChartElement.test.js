import React from "react";
import TrailsChartElement from "../components/trailsChartElement.js";
import renderer from "react-test-renderer";
import theme from "../styles/theme";
import { ThemeProvider } from "emotion-theming";

const props = {
  name: "Fun Trail",
  url: "/trails/60",
  distance: 60,
  id: 1001
};

it("renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <TrailsChartElement {...props} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
