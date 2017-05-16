const glob = require('glob');
const exec = require('child_process').execSync;

glob("./tiles/*.mbtiles", (err, files) => {
  files.map(f => {
    const name = 'fivefourths.' + f.match(/\.\/.*\/(.*)\.mbtiles/)[1];
    exec(`mapbox upload ${name} ${f}`, {stdio: [0,1,2]});
  });
});
