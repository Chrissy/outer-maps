import GeoViewport from "@mapbox/geo-viewport";

const getOffsetCenter = ({
  center,
  zoom,
  width,
  height,
  offsetX = 0,
  offsetY = 0
}) => {
  const newView = GeoViewport.bounds(center, zoom, [width, height]);
  const newViewWidth = Math.abs(newView[0] - newView[2]);
  const newViewHeight = Math.abs(newView[1] - newView[3]);

  return [
    center[0] - newViewWidth * (offsetX / width / 2),
    center[1] - newViewHeight * (offsetY / height / 2)
  ];
};

export default getOffsetCenter;
