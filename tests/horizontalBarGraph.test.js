import React from "react";
import HorizontalBarGraph from "../components/horizontalBarGraph.js";
import renderer from "react-test-renderer";

it("renders", () => {
  const tree = renderer
    .create(
      <HorizontalBarGraph
        keys={["cat", "dog", "bird"]}
        values={[50, 500, 5000]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
