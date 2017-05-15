const glob = require('glob');
const exec = require('child_process').execSync;

glob("./tiles/*.geojson", (err, files) => {
  files.map(f => {
    const name = 'fivefourths.' + f.match(/\.\/.*\/(.*)\.geojson/)[1];
    exec(`mapbox upload ${name} ${f}`, {stdio: [0,1,2]});
  });
});
