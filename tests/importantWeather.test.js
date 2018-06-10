import React from 'react';
import ImportantWeather from '../components/importantWeather.js';
import renderer from 'react-test-renderer';

const props = {
  maxTemperature: 100,
  minTemperature: 0,
  chanceOfPercipitation: 12
}

it('renders', () => {
  const tree = renderer.create(<ImportantWeather {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
