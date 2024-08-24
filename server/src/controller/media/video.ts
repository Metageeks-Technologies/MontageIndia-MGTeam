import catchAsyncError from "@src/middleware/catchAsyncError";
import { getTranscodeStatus } from "@src/lib/resizeVideo";
import { getUrl } from "@src/lib/uploadToS3";
import EmcMedia from "@src/model/product/emcJob";
import { MetaData } from "@src/types/product";
import Product from "@src/model/product/product";

export const uploadVideo = catchAsyncError(async (req, res, next) => {
  const { uuid, filename, length } = req.query;

  const name = filename as string;
  const nameArr = name.split(".");
  const fileExtension = nameArr[nameArr.length - 1];
  const uuidStr = uuid as string;
  const key = uuidStr + "." + fileExtension;
  const url = await getUrl(key);

  const videoLength = Number(length);
  const product = await Product.findOneAndUpdate(
    { uuid },
    {
      length: videoLength,
    }
  );
  res.json({ success: true, url });
});

export const getJobIds = catchAsyncError(async (req, res, next) => {
  const { uuid } = req.query;

  const emcMediaJob = await EmcMedia.findOne({ uuid });
  console.log(emcMediaJob);

  res.json({ success: true, emcMediaJob });
});

export const getJobStatus = catchAsyncError(async (req, res, next) => {
  const { mainJobId, watermarkJobId } = req.query;

  console.log(req.query);

  const mainStatus = await getTranscodeStatus(mainJobId as string);
  const watermarkStatus = await getTranscodeStatus(watermarkJobId as string);

  console.log(mainStatus, watermarkStatus);
  // "SUBMITTED" || "PROGRESSING" || "COMPLETE" || "CANCELED" || "ERROR",
  let status = "progressing";
  if (
    mainStatus?.status == "ERROR" ||
    watermarkStatus?.status == "ERROR" ||
    watermarkStatus?.status == "CANCELED" ||
    mainStatus?.status == "CANCELED"
  )
    status = "error";
  if (mainStatus?.status == "COMPLETE" && watermarkStatus?.status == "COMPLETE")
    status = "complete";

  res.json({
    success: true,
    process: {
      status,
      percentage: mainStatus?.completePercentage,
    },
  });
});
