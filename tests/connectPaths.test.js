import connectPaths from "../modules/connectPaths";

const paths = [
  [[0, 0], [0, 1], [1, 1]],
  [[1, 1], [2, 1], [2, 2]],
  [[2, 2], [2, 4], [0, 0]],
  [[4, 2], [0, 1], [1, 1]],
  [[[4, 2], [0, 1], [1, 1]], [[5, 5], [0, 1], [0, 0]]],
  [[[0, 0], [0, 1], [0, 0]], [[0, 0], [0, 1], [2, 2]]]
].map((p, index) => {
  return Array.isArray(p[0][0])
    ? p.map(p =>
      p.map((p, i) => {
        return { coordinates: p, index: i, id: index };
      })
    )
    : p.map((p, i) => {
      return { coordinates: p, index: i, id: index };
    });
});

test("can connect end to beginning", () => {
  const connected = connectPaths(paths[0], paths[1]);
  const lastArray = connected[connected.length - 1];
  expect(connected[0][0].coordinates).toEqual([0, 0]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([2, 2]);
});

test("can connect beginning to end", () => {
  const connected = connectPaths(paths[0], paths[2]);
  const lastArray = connected[connected.length - 1];
  expect(connected[0][0].coordinates).toEqual([2, 2]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([1, 1]);
});

test("can connect end to end", () => {
  const connected = connectPaths(paths[0], paths[3]);
  const lastArray = connected[connected.length - 1];
  expect(connected[0][0].coordinates).toEqual([0, 0]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([4, 2]);
});

test("can connect nested end to beginning", () => {
  const connected = connectPaths(paths[4], paths[0]);
  const lastArray = connected[connected.length - 1];

  expect(connected[0][0].coordinates).toEqual([4, 2]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([1, 1]);
});

test("can connect nested beginning to end", () => {
  const connected = connectPaths(paths[5], paths[1]);
  const lastArray = connected[connected.length - 1];

  expect(connected[0][0].coordinates).toEqual([0, 0]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([1, 1]);
});

test("can connect nested end to end", () => {
  const connected = connectPaths(paths[4], paths[2]);
  const lastArray = connected[connected.length - 1];

  expect(connected[0][0].coordinates).toEqual([4, 2]);
  expect(lastArray[lastArray.length - 1].coordinates).toEqual([2, 2]);
});
