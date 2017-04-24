const helpers = require('@turf/helpers');
const threePointsToAngle = require('./statUtils').threePointsToAngle;

exports.explodeLineStringByAngles = (line, threshold) => {
  const coords = line.coordinates;

  if (coords.length == 1 || coords.length == 0) return line;

  const minAngle = (threshold / 180) * 3.14159;
  const multiArray = [];

  coords.forEach((p, i) => {
    if (i == 0) return multiArray.push([p]);
    multiArray[multiArray.length - 1].push(p);
    if (i == coords.length - 1) return;
    const pointAngle = threePointsToAngle(coords[i - 1], p, coords[i + 1]);
    if (pointAngle < minAngle) multiArray.push([p]);
  });

  return multiArray.map(l => helpers.lineString(l));
}
