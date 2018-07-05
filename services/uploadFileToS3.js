const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const uploadFileToS3 = ({ key, data }) => {
  s3.putObject(
    { Bucket: "chrissy-gunk", Key: key, Body: data, ACL: "public-read" },
    () => {}
  );
};

module.exports = uploadFileToS3;
