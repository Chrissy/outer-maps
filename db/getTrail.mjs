import {query} from './genericQuery';
import {rollingAverage, glitchDetector} from '../modules/statUtils';

const sql = (id) => `
  WITH trail AS (
      SELECT geog::geometry AS path
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
    SELECT to_json(array_agg(elevations)) as points from trail, raster, elevations GROUP BY rast;
`;

const getTrail = (id, pool) => new Promise((resolve) => {
  query(sql(id), pool, ({rows}) => {
    const elevations = rollingAverage(glitchDetector(rows[0].points.map(r => r.elevation)), 40);
    const points = elevations.map((r, i) => ({
      elevation: r,
      coordinates: [rows[0].points[i].x, rows[0].points[i].y]
    }));

    resolve({points});
  });
});

export default getTrail;
