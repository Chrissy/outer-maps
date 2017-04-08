export const wrap = (elements) => {
  const formattedElements = elements.map(element => {
    return {
      "type": "Feature",
      "properties": {
        "id": element.id
      },
      "geometry": element.geometry
    };
  });

  return {
    "type": "FeatureCollection",
    "features": formattedElements
  };
}

export const makePoints = (pointsAsArray) => {
  const pointsOrEmpty = (pointsAsArray && pointsAsArray.length) ? pointsAsArray : [];

  const pointToFeature = function(point) {
    return {
      type: "Feature",
      properties: {
        id: point.id,
        trailId: point.trailId
      },
      geometry: {
        type: "Point",
        coordinates: point.coordinates,
    }}
  }

  return {
   type: "FeatureCollection",
   features: pointsOrEmpty.map(p => pointToFeature(p))
  }
}
