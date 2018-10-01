import React from "react";
import HorizontalBarGraph from "../components/horizontalBarGraph.js";
import renderer from "react-test-renderer";
import theme from "../styles/theme";
import { ThemeProvider } from "emotion-theming";

it("renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <HorizontalBarGraph
          keys={["cat", "dog", "bird"]}
          values={[50, 500, 5000]}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
