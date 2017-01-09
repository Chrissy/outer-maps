const rollingAverage = function(a, size) {
  return a.map((e, i) => parseInt((a[i] + a[i + 1] + a[i - 1]) / 3)).slice(1).slice(0, -1)
}

const glitchDetector = function(array, size) {
  return array.filter((el, i) => {
    for (var x = size * -1; x <= size; x++) {
      if (array[i + x] !== el) return false;
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
