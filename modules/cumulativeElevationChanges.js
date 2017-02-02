var rollingAverage = function(array, size) {
  return array.map((element, index) => {
    var total = 0
    for (var offset = -size; offset <= size; offset++) {
      total += (array[index + offset] == undefined) ? array[index] : array[index + offset];
    };
    return parseInt(total/(size * 2 + 1));
  });
}

const glitchDetector = function(array) {
  return array.map((element, index) => {
    if (index == 0 || index >= array.length - 2) return element;
    if (array[index - 1] == array[index + 1] && array[index - 1] !== element) return array[index - 1];
    return element;
  });
}

export function cumulativeElevationChanges(elevations) {
  var elevationGain = 0, elevationLoss = 0;
  var smoothElevations = rollingAverage(glitchDetector(elevations.map(e => e[0])), 2);

  var recoupledElevations = smoothElevations.map(function(el, i) {
    let el2 = smoothElevations[i + 1];

    if (el < el2) elevationGain += el2 - el;
    if (el > el2) elevationLoss += el - el2;

    return [el, elevations[i][1]];
  }).filter(e => e[0] !== false);

  return {
    elevationGain: elevationGain,
    elevationLoss: elevationLoss,
    elevations: recoupledElevations
  };
}
