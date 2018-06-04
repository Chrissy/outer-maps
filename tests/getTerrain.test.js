const getTerrain = require('../modules/getTerrain');

test('terrain downloads with cache', async () => {
  const terrain = await getTerrain({
    x: 120.935243081307,
    y: 48.57246675272445,
    zoom: 13
  });
  expect(terrain.cached).toBe(true);
});

test('terrain downloads without cache', async () => {
  const terrain = await getTerrain({
    x: 120.935243081307,
    y: 48.57246675272445,
    zoom: 13,
    cache: false
  });
  expect(terrain.cached).toBe(false);
});
