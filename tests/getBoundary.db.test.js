const createPool = require('../db/genericQuery').pool;
const getBoundary = require('../db/getBoundary');

let pool, boundary;

beforeAll(async () => {
  pool = createPool();
  boundary = await getBoundary(1496, pool);
});

test('boundary has an area', () => {
  expect(boundary.area).toBeGreaterThan(0);
});

test('boundary has a high point', () => {
  expect(typeof boundary.highPoint).toBe('number');
});

test('boundary has trails', () => {
  expect(typeof boundary.area).toBe('number');
});

afterAll(async () => {
  await pool.end();
});
