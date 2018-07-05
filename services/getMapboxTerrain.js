const accessToken =
  "pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg";
const uploadImageToS3 = require("./uploadImageToS3").upload;
const tryCachedFile = require("./tryCachedFile");

const getTerrain = ({ x, y, zoom }) =>
  new Promise(resolve => {
    const key = `terrain-${x}-${y}-${zoom}.jpg`;
    const url = `https://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;

    tryCachedFile(key).then(file => {
      if (file.cached) {
        resolve(file.url);
      } else {
        uploadImageToS3({ url, key, quality: 30 });
        resolve(url);
      }
    });
  });

module.exports = getTerrain;
