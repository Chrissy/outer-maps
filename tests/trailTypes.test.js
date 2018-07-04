import React from "react";
import TrailTypes from "../components/trailTypes";
import renderer from "react-test-renderer";

it("renders", () => {
  const tree = renderer
    .create(<TrailTypes hike={30} bike={30} ohv={0} horse={40} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
