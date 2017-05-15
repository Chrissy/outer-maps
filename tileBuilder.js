const glob = require('glob');
const exec = require('child_process').execSync;

glob("./tiles/*.geojson", (err, files) => {
  exec(`tippecanoe -f -P -M 100000 -as -an -al -ap -o ./tiles/local.mbtiles ${files.join(" ")}`, {stdio: [0,1,2]});
  console.log("Tiles are cached into memory by the server. You will need to restart!")
});
