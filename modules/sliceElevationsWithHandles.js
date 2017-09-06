export default (trail, handles) => {
  const hs = handles.filter(h => h.trailId == trail.id);
  if (hs.length < 2) return trail;

  const indeces = hs.map(h => h.index).sort((a,b) => a - b);
  return Object.assign({}, trail, {
    points: trail.points.slice(indeces[0], indeces[1])
  });
}
