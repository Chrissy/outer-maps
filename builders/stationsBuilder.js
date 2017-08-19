const fs = require('fs');
const fixy = require('fixy');

const precip = fs.readFileSync(process.env.LIB + "/noaa_stations/normals-prcp-inventory.txt").toString();
const temp = fs.readFileSync(process.env.LIB + "/noaa_stations/normals-temp-inventory.txt").toString();

console.log("parsing stations")

const parse = (stationsString) => fixy.parse({
  map:[{
    name: "id",
    width: 11,
    start: 1,
    type: "string"
  },{
    name: "lat",
    width: 9,
    start: 12,
    type:"float",
    percision: 4
  },{
    name: "long",
    width: 9,
    start: 22,
    type: "float",
    percision: 4
  },{
    name: "altitude",
    width: 7,
    start: 31,
    type: "float"
  },{
    name: "country",
    width: 2,
    start: 38,
    type: "string"
  },{
    name: "name",
    width: 30,
    start: 42,
    type: "string"
  }], options: {
    fullwidth: 99,
    skiplines: null
  }
}, stationsString);

const parseNumbers = (stations) => stations.map(s => Object.assign({}, s, {
  lat: parseFloat(s.lat),
  long: parseFloat(s.long),
  altitude: parseFloat(s.altitude),
  endYear: parseInt(s.endYear),
  startYear: parseInt(s.startYear)
}));


const northAmerica = (stations) => stations.filter(s => s.lat > 18 && s.lat < 72 && s.long < -65 && s.long > -170);
const filteredPrecip = northAmerica(parseNumbers(parse(precip)));
const filteredTemp = northAmerica(parseNumbers(parse(temp)));

console.log(`combining ${filteredPrecip.length} precipitation stations with ${filteredTemp.length} temperature stations`);

const geoJsonStations = filteredPrecip.filter(p => filteredTemp.find(t => p.id == t.id)).map(s => ({
  type:"Feature",
  properties: {
    name: s.name,
    altitude: s.altitude,
    stationId: s.id
  },
  geometry: {
    type: "Point",
    coordinates: [s.long, s.lat]
  }
}))

const geoJson = {type:"FeatureCollection", features: geoJsonStations};
fs.writeFileSync(process.env.LIB + "/noaa_stations/stations.geojson", JSON.stringify(geoJson));
