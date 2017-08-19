const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3();

s3.putObject({Bucket: 'chrissy-gunk', Key: 'bundle.js', Body: fs.readFileSync("./public/dist/bundle.js"), ACL:'public-read'}, (err, data) => {
  console.log("compiled applicaion bundle succesfully uploaded to s3");
});
