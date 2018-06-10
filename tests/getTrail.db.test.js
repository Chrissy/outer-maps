const createPool = require('../db/genericQuery').pool;
const getTrail = require('../db/getTrail');

let pool, trail;

beforeAll(async () => {
  pool = createPool();
  trail = await getTrail(141044, pool);
});

test('trail has points', () => {
  expect(trail.points.length).toBeGreaterThan(0);
})

test('trail has coordinates', () => {
  expect(typeof trail.points[0].coordinates[0]).toBe('number');
  expect(typeof trail.points[0].coordinates[1]).toBe('number');
});

test('trail has elevation', () => {
  expect(typeof trail.points[0].elevation).toBe('number');
});

afterAll(async () => {
  await pool.end();
});
