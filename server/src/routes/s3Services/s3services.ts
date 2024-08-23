import express from 'express';
import { generateUploadPresignedUrl, generateGetPresignedUrl } from '@src/controller/user/AwsS3Services';
import { isAuthenticatedCustomer } from '@src/middleware/auth';

const s3Router = express.Router();
s3Router.post('/getUploadRrl',isAuthenticatedCustomer, async (req, res) => {
    const { folder, fileName } = req.body;
    if (!folder || !fileName) {
      return res.status(400).json({ error: 'Folder and fileName are required' });
    }
  
    const key = `${folder}/${fileName}`;
    try {
      const url = await generateUploadPresignedUrl(key);
      res.status(200).json({ url });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // s3Router.get('/generate-get-url',isAuthenticatedCustomer, async (req, res) => {
  //   const key  = req.params;
  //   if (!key) {
  //     return res.status(400).json({ error: 'Key is required' });
  //   }
  
  //   try {
  //     const url = await generateGetPresignedUrl(key as string);
  //     res.status(200).json({ url });
  //   } catch (error:any) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });

  export default s3Router