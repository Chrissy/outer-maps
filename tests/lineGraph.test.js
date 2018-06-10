import React from 'react';
import LineGraph from '../components/lineGraph.js';
import renderer from 'react-test-renderer';

const elevations =  [
  {
    distanceFromPreviousPoint: 1,
    elevation: 1000
  },
  {
    distanceFromPreviousPoint: 5,
    elevation: 10000
  },
  {
    distanceFromPreviousPoint: 1000,
    elevation: 33
  }
]

it('renders', () => {
  const tree = renderer.create(<LineGraph elevations={elevations} />).toJSON();
  expect(tree).toMatchSnapshot();
});
