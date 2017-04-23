exports.rollingAverage = function(array, size) {
  return array.map((element, index) => {
    var total = 0
    for (var offset = -size; offset <= size; offset++) {
      total += (array[index + offset] == undefined) ? array[index] : array[index + offset];
    };
    return parseInt(total/(size * 2 + 1));
  });
}

exports.glitchDetector = function(array) {
  return array.map((element, index) => {
    if (index == 0 || index >= array.length - 2) return element;
    if (array[index - 1] == array[index + 1] && array[index - 1] !== element) return array[index - 1];
    return element;
  });
}

exports.threePointsToAngle = (a, b, c) => {
  var ab = Math.sqrt(Math.pow(b[0]-a[0],2)+ Math.pow(b[1]-a[1],2));
  var bc = Math.sqrt(Math.pow(b[0]-c[0],2)+ Math.pow(b[1]-c[1],2));
  var ac = Math.sqrt(Math.pow(a[0]-c[0],2)+ Math.pow(a[1]-c[1],2));
  return Math.acos((bc*bc+ab*ab-ac*ac)/(2*bc*ab));
}
