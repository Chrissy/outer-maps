export function metersToFeet(meters) {
  return parseInt(meters*3.28084);
}

export function metersToMiles(meters) {
  return Math.round((meters*0.000621371) * 10) / 10;
}

export function distance(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}
