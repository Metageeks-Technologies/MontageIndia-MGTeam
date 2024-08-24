// awsConfig.ts
import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

const s3 = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
  },
});

export default s3;
