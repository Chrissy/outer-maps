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
