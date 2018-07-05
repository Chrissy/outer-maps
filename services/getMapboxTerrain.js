const Jimp = require("jimp");
const uploadFileToS3 = require("./uploadFileToS3");
const tryCachedFile = require("./tryCachedFile");

const accessToken =
  "pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg";

const getTerrain = ({ x, y, zoom }) =>
  new Promise(resolve => {
    const key = `terrain-${x}-${y}-${zoom}.jpg`;
    const url = `https://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;

    tryCachedFile(key).then(file => {
      if (file.cached) {
        resolve(file.url);
      } else {
        Jimp.read(url).then(image => {
          image.quality(30).getBuffer(Jimp.MIME_JPEG, (err, data) => {
            if (err) throw err;
            uploadFileToS3({ key, data });
          });
        });
        resolve(url);
      }
    });
  });

module.exports = getTerrain;
