import React from "react";
import DifficultyChart from "../components/difficultyChart.js";
import renderer from "react-test-renderer";

it("renders", () => {
  const tree = renderer.create(<DifficultyChart score={80} />).toJSON();
  expect(tree).toMatchSnapshot();
});
