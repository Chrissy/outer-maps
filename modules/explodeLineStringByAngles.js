const helpers = require('@turf/helpers');

const threePointsToAngle = (a, b, c) => {
  var ab = Math.sqrt(Math.pow(b[0]-a[0],2)+ Math.pow(b[1]-a[1],2));
  var bc = Math.sqrt(Math.pow(b[0]-c[0],2)+ Math.pow(b[1]-c[1],2));
  var ac = Math.sqrt(Math.pow(a[0]-c[0],2)+ Math.pow(a[1]-c[1],2));
  return Math.acos((bc*bc+ab*ab-ac*ac)/(2*bc*ab));
}

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
