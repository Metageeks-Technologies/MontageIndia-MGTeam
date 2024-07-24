import express from 'express';
import { reduceVideo, uploadVideo, getJobProgress } from '../../controller/media/video';

const videoRouter = express.Router();

videoRouter.route("/reduce").post(reduceVideo);
videoRouter.route('/getUrl').post(uploadVideo);
videoRouter.route('/transcode/progress').get(getJobProgress);
videoRouter.route('/progress/:jobId').get(getJobProgress);


export default videoRouter;
