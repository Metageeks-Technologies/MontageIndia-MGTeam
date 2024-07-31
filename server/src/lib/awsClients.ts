
import { MediaConvertClient } from "@aws-sdk/client-mediaconvert";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import config from "@src/utils/config";

const {awsRegion,awsAccessKey,awsSecretKey}=config;

export const emcClient = new MediaConvertClient({ 
    region:awsRegion,
    credentials:{
        accessKeyId:awsAccessKey,
        secretAccessKey:awsSecretKey
}});

export const sqsClient = new SQSClient({ 
    region:awsRegion, 
    credentials:{
        accessKeyId:awsAccessKey,
        secretAccessKey:awsSecretKey
    }
})

export const s3Client = new S3Client({ 
    region:awsRegion, 
    credentials:{
        accessKeyId:awsAccessKey,
        secretAccessKey:awsSecretKey
    }
});
