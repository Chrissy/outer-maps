export function cumulativeElevationChanges(elevations) {
  var elevationGain = 0;
  var elevationLoss = 0;

  elevations.forEach(function(el, i) {
    let el2 = elevations[i + 1];

    if (!el || !el2) return;
    if (el < el2) elevationGain += el2 - el;
    if (el > el2) elevationLoss += el - el2;
  })

  return {
    elevationGain: elevationGain,
    elevationLoss: elevationLoss
  };
}
