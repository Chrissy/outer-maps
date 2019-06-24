const query = require("./genericQuery").query;
const statUtils = require("../modules/statUtils");
const uploadFileToS3 = require("../services/uploadFileToS3");

const sql = id => `
  WITH trail AS (
      SELECT name, station1, geog::geometry AS path
      FROM trails
      WHERE id = ${id}
    ),
    points AS (
      SELECT (ST_DumpPoints(path)).geom AS point
      FROM trail
    ), raster AS (
      SELECT ST_Union(rast) AS rast FROM elevation
      CROSS JOIN trail
      WHERE ST_Intersects(rast, ST_Envelope(path)) GROUP BY path
    ), elevations as (
      SELECT
        ST_Value(rast, point) as elevation,
        ST_X(point) as x,
        ST_Y(point) as y
      FROM raster, trail
      CROSS JOIN points
    )
    SELECT name, station1, to_json(array_agg(elevations)) as points from trail, raster, elevations GROUP BY name, station1, rast;
`;

const getTrail = (id, pool) =>
  new Promise(resolve => {
    queryTrail({ id, pool }).then(data => {
      uploadFileToS3({
        key: `trail-${id}.json`,
        data: JSON.stringify(data)
      });
      resolve(data);
    });
  });

const queryTrail = ({ id, pool }) =>
  new Promise(resolve => {
    query(sql(id), pool, ({ rows }) => {
      const { name, station1, points } = rows[0];

      const elevations = statUtils.rollingAverage(
        statUtils.glitchDetector(points.map(r => r.elevation)),
        40
      );

      const pointsWithElevations = elevations.map((r, i) => ({
        elevation: r,
        coordinates: [points[i].x, points[i].y]
      }));

      resolve({ name, station1, points: pointsWithElevations });
    });
  });

module.exports = getTrail;
