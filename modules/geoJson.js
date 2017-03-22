exports.make = (response) => {
  const formattedRows = response.rows.map(row => {
    return {
      "type": "Feature",
      "properties": {
        "id": row.id
      },
      "geometry": JSON.parse(row.geog)
    };
  });

  return {
    "type": "FeatureCollection",
    "features": formattedRows
  };
}

exports.boxToBounds = (boxShape) => {
  const xPoints = boxShape.coordinates[0].map(b => b[0]);
  const yPoints = boxShape.coordinates[0].map(b => b[1]);
  return [[Math.min(...xPoints), Math.min(...yPoints)], [Math.max(...xPoints), Math.max(...yPoints)]]
}

exports.makePoints = (pointsAsArray) => {
  const pointToFeature = function(point) {
    return {type: "Feature",
      geometry: {
          type: "Point",
          coordinates: point.coordinates
    }}
  }

  return {
   type: "FeatureCollection",
   features: pointsAsArray.map(p => pointToFeature(p))
  }
}
