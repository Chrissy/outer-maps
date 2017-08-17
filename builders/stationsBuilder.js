const fs = require('fs');
const fixy = require('fixy');
const env = process.env;

const stationsString = fs.readFileSync(env.libDirectory + "/noaa_stations/ghcnd-stations.txt").toString();
const inventoryString = fs.readFileSync(env.libDirectory + "/noaa_stations/ghcnd-inventory.txt").toString();

console.log("parsing stations")

const stations = fixy.parse({
  map:[{
    name: "id",
    width: 11,
    start: 1,
    type: "string"
  },{
    name: "lat",
    width: 9,
    start: 12,
    type:"float"
  },{
    name: "long",
    width: 9,
    start: 22,
    type: "float"
  },{
    name: "altitude",
    width: 7,
    start: 31,
    type: "string"
  }, {
    name: "name",
    width: 30,
    start: 42,
    type: "string"
  }], options: {
    fullwidth: 85,
    skiplines: null
  }
}, stationsString);

console.log("parsing inventory")

const inventory = fixy.parse({
  map:[
    {name: "id",
    width: 11,
    start: 1,
    type: "string"
  },{
    name: "lat",
    width: 9,
    start: 12,
    type:"float"
  },{
    name: "long",
    width: 9,
    start: 22,
    type: "float"
  },{
    name: "dataType",
    width: 5,
    start: 31,
    type: "string"
  }, {
    name: "startYear",
    width: 5,
    start: 36,
    type: "string"
  },{
    name: "endYear",
    width: 5,
    start: 41,
    type: "string"
  }], options: {
    fullwidth: 45,
    skiplines: null
  }
}, inventoryString);

console.log("removing unecessary stations")

const parseFloats = (stations) => stations.map(s => Object.assign({}, s, {
  lat: parseFloat(s.lat),
  long: parseFloat(s.long),
  altitude: parseFloat(s.altitude)
}));
const northAmerica = (stations) => stations.filter(s => s.lat > 18 && s.lat < 72 && s.long < -65 && s.long > -170);
const filteredInventory = northAmerica(parseFloats(inventory)).filter(i => i.endYear >= 2010 && i.endYear - i.startYear >= 10);
const filteredStations = northAmerica(parseFloats(stations));

console.log(`merging ${filteredStations.length} stations into ${filteredInventory.length} inventories`)

const geoJsonStations = filteredStations.map(s => ({
  type:"Feature",
  properties: {
    name: s.name,
    altitude: s.altitude,
    stationId: s.id,
    dataTypes: inventory.filter(i => i.id == s.id).map(i => i.dataType).join(" "),
  },
  geometry: {
    type: "Point",
    coordinates: [s.long, s.lat]
  }
}))

const geoJson = {type:"FeatureCollection", features: geoJsonStations};
fs.writeFileSync(env.libDirectory + "/noaa_stations/stations.geojson", JSON.stringify(geoJson));
