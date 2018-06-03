const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const uploadImageToS3 = require('./uploadImageToS3').upload;

const getTerrain = ({x, y, zoom}, pool) => new Promise((resolve) => {
  const key = `terrain-${x}-${y}-${zoom}.jpg`;
  const cachedImagePath = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${key}`;
  const url = `https://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;

  s3.headObject({Bucket: 'chrissy-gunk', Key: key}, (err, metadata) => {
    if (metadata) {
      resolve({url: cachedImagePath, cached: true});
    } else {
      resolve({url: url, cached: false});
      uploadImageToS3({url, key, quality: 30})
    }
  });
});

module.exports = getTerrain;
