exports.make = (boxShape) => {
  const xPoints = boxShape.coordinates[0].map(b => b[0]);
  const yPoints = boxShape.coordinates[0].map(b => b[1]);
  return [[Math.min(...xPoints), Math.min(...yPoints)], [Math.max(...xPoints), Math.max(...yPoints)]]
}
