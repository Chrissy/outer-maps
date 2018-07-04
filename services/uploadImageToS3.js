import Jimp from 'jimp';
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

const uploadImageToS3 = ({url, key, quality}) => {
  Jimp.read(url).then(image => {
    image.quality(quality).getBuffer(Jimp.MIME_JPEG, (err, buff) => {
      if (err) throw err;
      s3.putObject({Bucket: 'chrissy-gunk', Key: key, Body: buff, ACL:'public-read'}, () => {});
    });
  });
};

exports.upload = uploadImageToS3;
