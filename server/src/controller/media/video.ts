import dotenv from 'dotenv';
import catchAsyncError from "../../middleware/catchAsyncError";
import { getTranscodeProgress, handleReduceVideos, handleVideoWithWaterMark } from "../../lib/resizeVideo";
import { getUrl } from "../../lib/uploadToS3";
dotenv.config();

export const uploadVideo = catchAsyncError(async (req, res, next) => {
    const { name } = req?.body;

    const url = await getUrl(name)
    res.json({ success: true, url })
})

export const getJobProgress = catchAsyncError(async (req, res, next) => {
    const { jobId } = req.params;

    const data = await getTranscodeProgress()

    res.json({ success: true, data })
})

export const getJobStatus = catchAsyncError(async (req, res, next) => {
    const { jobId } = req.params;

    const data = await getTranscodeProgress()

    res.json({ success: true, data })
})





