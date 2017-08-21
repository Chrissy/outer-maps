export default (trail) => {
  if (!trail.handles) return trail;
  const indeces = trail.handles.map(h => h.index).sort((a,b) => a - b);
  return Object.assign({}, trail, {
    points: trail.points.slice(indeces[0], indeces[1])
  });
}
