import connectPaths from "../modules/connectPaths";

const paths = [
  [[0, 0], [0, 1], [1, 1]],
  [[1, 1], [2, 1], [2, 2]],
  [[2, 2], [2, 4], [0, 0]],
  [[4, 2], [0, 1], [1, 1]]
].map((p, index) =>
  p.map((p, i) => {
    return { coordinates: p, index: i, id: index };
  })
);

test("can connect end to beginning", () => {
  const connected = connectPaths(paths[0], paths[1]);
  expect(connected[0].coordinates).toEqual([0, 0]);
  expect(connected[connected.length - 1].coordinates).toEqual([2, 2]);
});

test("can connect beginning to end", () => {
  const connected = connectPaths(paths[0], paths[2]);
  expect(connected[0].coordinates).toEqual([1, 1]);
  expect(connected[connected.length - 1].coordinates).toEqual([2, 2]);
});

test("can connect end to end", () => {
  const connected = connectPaths(paths[0], paths[3]);
  expect(connected[0].coordinates).toEqual([0, 0]);
  expect(connected[connected.length - 1].coordinates).toEqual([4, 2]);
});
