const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path').normalize;
const execSync = require('child_process').execSync;
const directoryName = "idaho_trails"
const workingDir = path(process.env.LIB + "/" + directoryName);

export const convertCrazyKmlAttributes = function() {
  const readPath = path(process.env.LIB + "/" + directoryName + "/idaho-nonmotorized.geojson");
  const writePath = path(process.env.LIB + "/" + directoryName + "/idaho-nonmotorized-converted.geojson");


  if (fs.existsSync(writePath)) return;

  const parser = new xml2js.Parser({strict:false});
  const trails = JSON.parse(fs.readFileSync(readPath, 'utf8'));
  let newTrails = Object.assign({}, trails);

  trails.features.forEach((feature, i) => {
    const parsedAttributes = parser.parseString(feature.properties.description, function(err, result) {
      if (err) throw err;
      let name = result.HTML.BODY[0].TABLE[0].TR[1].TD[0].TABLE[0].TR[1].TD[1];

      newTrails.features[i].properties = {
        name: (name && name !== 'Null' && name !== '<Null>') ? name : '',
        sourceId: i,
      }
    })
  });

  fs.writeFileSync(writePath, JSON.stringify(newTrails));
}
