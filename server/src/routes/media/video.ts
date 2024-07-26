import express from 'express';
import { uploadVideo, getJobStatus } from '../../controller/media/video';

const videoRouter = express.Router();

videoRouter.route('/upload').get(uploadVideo);
videoRouter.route('/transcode/progress').get(getJobStatus);

export default videoRouter;
