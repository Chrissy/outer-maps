const reversePoints = points => {
  return [...points].reverse().map((point, i) => {
    return {
      ...point,
      distance: i == 0 ? 0 : points[i - 1].distance,
      elevationGain: point.elevationLoss,
      elevationLoss: point.elevationGain
    };
  });
};

export default reversePoints;
