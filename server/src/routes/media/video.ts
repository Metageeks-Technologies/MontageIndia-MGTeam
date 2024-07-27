import express from 'express';
import { uploadVideo, getJobStatus,getJobIds } from '../../controller/media/video';

const videoRouter = express.Router();

videoRouter.route('/upload').get(uploadVideo);
videoRouter.route('/transcode/progress').get(getJobStatus);
videoRouter.route('/job-id').get(getJobIds);



export default videoRouter;
