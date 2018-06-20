import React from "react";
import TrailsChartElement from "../components/trailsChartElement.js";
import renderer from "react-test-renderer";

const props = {
  name: "Fun Trail",
  url: "/trails/60",
  distance: 60,
  id: 1001
};

it("renders", () => {
  const tree = renderer.create(<TrailsChartElement {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
