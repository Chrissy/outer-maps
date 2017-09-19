import GeoViewport from '@mapbox/geo-viewport';

const getSatelliteImage = ({bounds, minZoom, maxZoom}) => {
  const {center, zoom} = GeoViewport.viewport(bounds, [1024, 1024], minZoom, maxZoom);
  return fetch(`/api/terrain/${center.join("/")}/${zoom}`).then((r) => r.blob());
};

export default getSatelliteImage;
