const glob = require('glob');
const exec = require('child_process').execSync;

glob("./tiles/*", (err, files) => {
  files.map(f => {
    console.log("uploading " + f)
    const name = 'fivefourths.' + f.match(/\.\/.*\/(.*)\.(mbtiles|geojson)/)[1];
    exec(`mapbox upload ${name} ${f}`, {stdio: [0,1,2]});
  });
});
