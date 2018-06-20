const helpers = require("@turf/helpers");
const lineDistance = require("@turf/line-distance");
const bezier = require("@turf/bezier");

const threePointsToAngle = (a, b, c) => {
  var ab = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
  var bc = Math.sqrt(Math.pow(b[0] - c[0], 2) + Math.pow(b[1] - c[1], 2));
  var ac = Math.sqrt(Math.pow(a[0] - c[0], 2) + Math.pow(a[1] - c[1], 2));
  return Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab));
};

const explodeLineByAngle = (line, threshold) => {
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
};

const lineStringToLabelMultiLineString = (geom, minlength) => {
  const multiArray = explodeLineByAngle(geom, 150);
  const filteredLines = multiArray.filter(c => lineDistance(c) > minlength);

  if (filteredLines.length == 0) return null;

  const bezierLines = filteredLines.map(f => bezier(f, 500, 0.5));
  return helpers.multiLineString(bezierLines.map(l => l.geometry.coordinates));
};

exports.labelMaker = (geojson, minLength) => {
  const features = geojson.features.map(p => {
    return Object.assign(
      {},
      lineStringToLabelMultiLineString(p.geometry, minLength),
      {
        properties: p.properties
      }
    );
  });
  return helpers.featureCollection(features.filter(r => r.geometry !== null));
};
