var rollingAverage = function(array, size) {
  return a.map((element, index) => {
    var total = 0
    for (var offset = -size; offset <= size; offset++) {
      total += array[index + offset]
    };
    return parseInt(total/(size * 2 + 1));
  }).slice(size).slice(0, -size);
}

const glitchDetector = function(array, size) {
  return array.filter((element, index) => {
    for (var offset = -size; offset <= size; offset++) {
      if (array[index + offset] !== el) return false;
    };
    return true;
  });
}

export function cumulativeElevationChanges(elevations) {
  let elevationGain = 0;
  let elevationLoss = 0;

  let smooth_elevations = rollingAverage(glitchDetector(elevations));

  smooth_elevations.forEach(function(el, i) {
    let el2 = smooth_elevations[i + 1];

    if (!el || !el2 || el == el2) return;

    if (el < el2) elevationGain += el2 - el;
    if (el > el2) elevationLoss += el - el2;
  });

  return {
    elevationGain: elevationGain,
    elevationLoss: elevationLoss
  };
}
