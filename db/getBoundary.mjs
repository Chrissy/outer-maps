import {query} from './genericQuery';
import _ from 'underscore';

const sql = (id) => `
  WITH boundary AS (
      SELECT ST_Area(geog) as area, id, ST_Simplify(geog::geometry, 0.05) as geom
      FROM boundaries
      WHERE id = ${id}
    ), raster AS (
      SELECT ST_Resize(ST_Clip(ST_Union(rast), ST_Envelope(geom)), 100, 100) AS rast FROM elevation, boundary
      WHERE ST_Intersects(rast, ST_Envelope(geom)) GROUP BY geom
    ), park_trails AS (
      SELECT trails.name, trails.id, trails.type, ST_Length(trails.geog) as length FROM boundary LEFT OUTER JOIN trails
      ON ST_Length(ST_Simplify(trails.geog::geometry, 1)::geography) > 1600
      AND ST_Intersects(ST_Envelope(boundary.geom), trails.geog)
      AND ST_Intersects(ST_Simplify(boundary.geom, 0.005), trails.geog) ORDER BY length DESC LIMIT 1000
    )
    SELECT boundary.area, boundary.id, to_json(ST_DumpValues(rast)) as dump,
    to_json(array_agg(park_trails)) as trails
    FROM boundary, raster, park_trails GROUP BY rast, area, boundary.id;
`;

const getBoundary = (id, pool) => new Promise((resolve) => {
  query(sql(id), pool, ({rows: [row]}) => {
    const vertices = row.dump.valarray;
    const flatVertices = _.flatten(vertices);
    const trails = (row.trails[0].id == null) ? [] : row.trails;

    resolve({
      area: parseInt(row.area),
      id: row.id,
      trailsCount: trails.length,
      trails: trails.slice(0, 8),
      highPoint: Math.max(...flatVertices),
      trailTypes: {
        hike: trails.filter(t => t.type == "hike").length || 0,
        bike: trails.filter(t => t.type == "bike").length || 0,
        horse: trails.filter(t => t.type == "horse").length || 0,
        ohv: trails.filter(t => t.type == "atv" || t.type == "motorcycle").length || 0
      },
      trailLengths: [
        ["1-3", trails.filter(t => t.length <= 4828).length || 0],
        ["3-7", trails.filter(t => t.length > 4828 && t.length <= 11265).length || 0],
        ["7-15", trails.filter(t => t.length > 11265 && t.length <= 24140).length || 0],
        ["15-25", trails.filter(t => t.length > 24140 && t.length <= 32186).length || 0],
        ["25+", trails.filter(t => t.length >= 40233).length || 0]
      ],
    });
  });
});

export default getBoundary;
