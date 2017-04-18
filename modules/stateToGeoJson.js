import {point, feature, featureCollection} from '@turf/helpers';
import lineSlice from '@turf/line-slice';

export const pointToPoint = (toConvert) => {
  const asFeature = point(toConvert.coordinates);
  return {...asFeature, properties: toConvert};
}

export const pointsToFeatureCollection = (points) => {
  if (!points.length) return featureCollection([]);
  return featureCollection(points.map(p => pointToPoint(p)));
}

export const trailToLine = (toConvert, opts) => {
  let props = {...toConvert};
  delete props.geometry;
  const asFeature = (props.handles) ? cropToHandles(toConvert) : toConvert.geometry;

  return {...asFeature, properties: props};
}

export const trailsToFeatureCollection = (trails) => {
  if (!trails.length) return featureCollection([]);
  return featureCollection(trails.map(t => trailToLine(t)));
}

const cropToHandles = (trail) => {
  const newTrail = trail;
  return lineSlice(pointToPoint(trail.handles[0]), pointToPoint(trail.handles[1]), trail.geometry);
}
