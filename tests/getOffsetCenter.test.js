import getOffsetCenter from '../modules/getOffsetCenter';

const mockData = {
  center: [-120.99861145019531, 48.52820133989286],
  zoom: 10,
  width: 1055,
  height: 759,
  offsetX: 227,
  offsetY: 0,
  width: 1055,
  zoom: 10
}

const coords = getOffsetCenter(mockData);

test('latitude is correct', () => {
  expect(coords[0]).toBe(-121.15447998046875);
});

test('longitude is correct', () => {
  expect(coords[1]).toBe(48.52820133989286);
})
