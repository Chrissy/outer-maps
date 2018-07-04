import React from "react";
import ElevationTotals from "../components/elevationTotals";
import renderer from "react-test-renderer";

const elevations = [
  {
    coordinates: [-121.01849819661, 48.5847955640306],
    id: 141044,
    index: 0,
    elevation: 985,
    elevationGain: 0,
    elevationLoss: 0,
    distanceFromPreviousPoint: 0
  },
  {
    coordinates: [-121.018136436568, 48.5846454373507],
    id: 141044,
    index: 1,
    elevation: 987,
    elevationGain: 2,
    elevationLoss: 0,
    distanceFromPreviousPoint: 31.42249865416899
  },
  {
    coordinates: [-121.017988374201, 48.5845484843434],
    id: 141044,
    index: 2,
    elevation: 989,
    elevationGain: 2,
    elevationLoss: 0,
    distanceFromPreviousPoint: 15.32921380080007
  }
];

it("renders", () => {
  const tree = renderer
    .create(<ElevationTotals elevations={elevations} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
