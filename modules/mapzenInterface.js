export function createAltitudeQueryString(coordinates) {
  let altitudeQueryString = '';
  let queryLimit = 20;

  coordinates.forEach(function(el, i){
    if (i % Math.ceil(coordinates.length/queryLimit) !== 0) return;

    let c = (i == 0) ? "" : ",";
    altitudeQueryString += `${c}{"lat":${el[1]}\,"lon":${el[0]}}`
  })

  return `http://elevation.mapzen.com/height?json={"range":true,"shape":[${altitudeQueryString}]}&api_key=elevation-cWuTyBg`;
}
