const utils = require('../modules/statUtils');

const testArray = [1,1,1,2,1,1,1];

test('rolling average removes an intrusive two', () => {
  const newArray = utils.rollingAverage(testArray, 2);
  expect(newArray.indexOf(2)).toBe(-1);
});

test('glitch detector removes an intrusive two', () => {
  const newArray = utils.glitchDetector(testArray);
  expect(newArray.indexOf(2)).toBe(-1);
});
