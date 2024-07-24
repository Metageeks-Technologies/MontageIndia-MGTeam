import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from 'fs'
import { s3Client } from "@src/lib/awsClients";
import config from "@src/utils/config";

const {awsBucketName:bucketName,}=config;

async function uploadImage(image: { folder: string, filename: string }) {

    const fileStream = fs.createReadStream(`output/${image.filename}`);

    
    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: `${image.folder}/${image.filename}`,
                Body: fileStream,
                ContentType: 'image/jpeg',
            },
        });
        await upload.done();
    } catch (err) {
        console.error(err);
    }


}
async function uploadAudio(image: { folder: string, filename: string }, subFolder: string) {


    const fileStream = fs.createReadStream(`${image.folder}/${image.filename}`);
  
    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: `audio/${subFolder}/${image.filename}`,
                Body: fileStream,
                ContentType: 'audio/mpeg',
            },
        });
        await upload.done();
    } catch (err) {
        console.error(err);
    }
}
const getUrl = async (fileName: string) => {

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `temp/${fileName}`, // The key (file path) for the object in the bucket
        ContentType: 'video/mp4',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log(signedUrl);
    return signedUrl;
}
export { uploadImage, getUrl, uploadAudio }