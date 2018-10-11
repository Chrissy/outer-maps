import distance from "@turf/distance";

const reversePoints = points => {
  return [...points].reverse().map((point, i) => {
    return {
      ...point,
      distance: i == 0 ? 0 : points[i - 1].distance,
      elevationGain: point.elevationLoss,
      elevationLoss: point.elevationGain
    };
  });
};

const reverseNestedArray = array => {
  return array.map(a => reversePoints(a));
};

const reverseArray = array => {
  return !array[0].coordinates
    ? reverseNestedArray(array)
    : reversePoints(array);
};

const connectPaths = (p1, p2) => {
  const firstFirstPoint = !p1[0].coordinates ? p1[0][0] : p1[0];
  const lastLastPoint = !p1[0].coordinates
    ? p1[p1.length - 1][p1[p1.length - 1].length - 1]
    : p1[p1.length - 1];

  const arr = [firstFirstPoint, lastLastPoint, p2[0], p2[p2.length - 1]].map(
    f => ({
      ...f,
      pid: f.id + ":" + f.index
    })
  );

  const [a1, a2, b1, b2] = arr;

  const [close1, close2] = arr
    .map(el => {
      const closestPoint = arr.filter(e => e.pid !== el.pid).sort((a1, b1) => {
        return (
          distance(a1.coordinates, el.coordinates) -
          distance(b1.coordinates, el.coordinates)
        );
      })[0];
      return {
        ...el,
        distance: distance(closestPoint.coordinates, el.coordinates)
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const p1IsNested = !p1[0].coordinates;

  if (close1.pid == a1.pid && close2.pid == b1.pid)
    return p1IsNested ? [...reverseArray(p1), p2] : [reverseArray(p1), p2];
  if (close1.pid == a1.pid && close2.pid == b2.pid)
    return p1IsNested ? [p2, ...p1] : [p2, p1];
  if (close1.pid == a2.pid && close2.pid == b2.pid)
    return p1IsNested ? [...p1, reverseArray(p2)] : [p1, reverseArray(p2)];
  return p1IsNested ? [...p1, p2] : [p1, p2];
};

export default connectPaths;
