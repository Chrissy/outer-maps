export function metersToFeet(meters) {
  return parseInt(meters*3.28084);
}

export function metersToMiles(meters) {
  return Math.round((meters*0.000621371) * 10) / 10;
}

export function convertToTitleCase(str) {
  if (!str) return str;
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
