export default (trail, handles) => {
  const matchingHandles = handles.filter(h => h.trailId == trail.id);
  if (matchingHandles.length < 2) return trail;

  const indeces = matchingHandles.map(h => h.index).sort((a, b) => a - b);
  return Object.assign({}, trail, {
    points: trail.points.slice(indeces[0], indeces[1])
  });
};
