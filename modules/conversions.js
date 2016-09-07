export function metersToFeet(meters) {
  return parseInt(meters*3.28084);
}

export function metersToMiles(meters) {
  return Math.round((meters*0.000621371) * 10) / 10;
}
