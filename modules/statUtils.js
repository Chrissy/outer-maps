exports.rollingAverage = function(array, size) {
  return array.map((element, index) => {
    var total = 0;
    for (var offset = -size; offset <= size; offset++) {
      total +=
        array[index + offset] == undefined
          ? array[index]
          : array[index + offset];
    }
    return parseInt(total / (size * 2 + 1));
  });
};

exports.glitchDetector = function(array) {
  return array.map((element, index) => {
    if (index == 0 || index >= array.length - 2) return element;
    if (array[index - 1] == array[index + 1] && array[index - 1] !== element)
      return array[index - 1];
    return element;
  });
};
