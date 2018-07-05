const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const tryCachedFile = key =>
  new Promise(resolve => {
    const cachedFile = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${key}`;

    s3.headObject({ Bucket: "chrissy-gunk", Key: key }, (err, metadata) => {
      if (metadata) {
        resolve({ url: cachedFile, cached: true });
      } else {
        resolve({ url: key, cached: false });
      }
    });
  });

module.exports = tryCachedFile;
