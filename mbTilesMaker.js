const glob = require('glob');
const exec = require('child_process').execSync;

glob("./tiles/*.geojson", (err, files) => {
  exec(`tippecanoe --force -o ./tiles/local.mbtiles ${files.join(" ")}`, {stdio: [0,1,2]});
});
