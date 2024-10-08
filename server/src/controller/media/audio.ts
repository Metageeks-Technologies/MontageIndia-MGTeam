import type { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import { uploadAudio } from "../../lib/uploadToS3";
import Product from "@src/model/product/product";
import { deleteLocalFile } from "@src/utils/helper";
import fs from "fs";
import type { MetaData } from "@src/types/product";

interface AudioMetadata {
  durationInSeconds: number;
  bitrateInKbps: number;
  fileSizeInMB: number;
}

ffmpeg.setFfmpegPath(ffmpegStatic as string);
ffmpeg.setFfprobePath(ffprobeStatic.path);

function getAudioMetadata(filePath: string): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    // Use ffprobe to extract metadata
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      try {
        // Get file size in MB
        const sizeInBytes = fs.statSync(filePath).size;
        const fileSizeInMB = sizeInBytes / (1024 * 1024);

        // Extract duration and bitrate from metadata
        const durationInSeconds = metadata.format.duration || 0;
        const bitrateInKbps: number = metadata.format.bit_rate
          ? parseInt(metadata.format.bit_rate.toString(), 10) / 1000
          : 0;

        // Resolve with the audio metadata
        resolve({
          durationInSeconds,
          bitrateInKbps: Math.round(bitrateInKbps),
          fileSizeInMB: parseFloat(fileSizeInMB.toFixed(2)), // Rounded to 2 decimal places
        });
      } catch (error) {
        reject(new Error("Error parsing metadata"));
      }
    });
  });
}

function addAudioWatermark(
  mainAudio: string,
  watermarkAudio: string,
  output: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = ffmpeg()
      .input(mainAudio)
      .input(watermarkAudio)
      .complexFilter([
        {
          filter: "amovie",
          options: { filename: watermarkAudio, loop: 0 },
          outputs: "beep",
        },
        {
          filter: "asetpts",
          options: { expr: "N/SR/TB" },
          inputs: "beep",
          outputs: "pts",
        },
        {
          filter: "amix",
          options: { inputs: 2, duration: "shortest" },
          inputs: ["0:a", "pts"],
          outputs: "mix",
        },
        {
          filter: "volume",
          options: { volume: 1 },
          inputs: "mix",
          outputs: "volume",
        },
      ])
      .outputOptions("-map", "[volume]")
      .save(output)
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err); // Reject the Promise in case of an error
      })
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", function () {
        console.log("Processing finished!");
        resolve(); // Resolve the Promise when processing is finished
      });
  });
}

export const reduceAudio = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      next(new ErrorHandler(`Can not get file`, 400));
    }
    console.log(req.file);
    const uuid = JSON.parse(req.body.uuid);
    const mediaType = JSON.parse(req.body.mediaType);
    if (mediaType !== "audio") {
      return next(new ErrorHandler("Wrong mediaType", 400));
    }
    const filenameArr = req.file?.originalname.split(".") as string[];
    const fileExtension = filenameArr[filenameArr?.length - 1];
    filenameArr.pop();
    const filename = filenameArr.join(".");

    const originalAudioPath = `audio/${filename}.${fileExtension}`;
    const watermarkAudioPath = "audio/watermark.wav";
    const outputAudioPath = `output/${filename}-watermarked.${fileExtension}`;

    try {
      await addAudioWatermark(
        originalAudioPath,
        watermarkAudioPath,
        outputAudioPath
      );
      console.log("Audio watermarking sussesfully:");
    } catch (error) {
      console.error("Audio watermarking failed:", error);
    }

    let audioMetaData: AudioMetadata;

    try {
      audioMetaData = await getAudioMetadata(originalAudioPath);
      console.log("Audio Metadata:", audioMetaData);
    } catch (error) {
      console.error("Error retrieving audio metadata:", error);
      return next(new ErrorHandler("Failed to retrieve audio metadata", 500));
    }

    const images = [
      { folder: `audio`, filename: `${filename}.${fileExtension}` },
      {
        folder: `output`,
        filename: `${filename}-watermarked.${fileExtension}`,
      },
    ];

    const s3images = [
      {
        folder: `${uuid}/audio`,
        filename: `${uuid}-original.${fileExtension}`,
      },
      {
        folder: `${uuid}/audio`,
        filename: `${uuid}-watermarked.${fileExtension}`,
      },
    ];

    for (let i = 0; i < s3images.length; i++) {
      try {
        await uploadAudio(images[i], s3images[i]);
      } catch (error) {
        console.log(error);
        next(new ErrorHandler(`Error uploading image`, 400));
      }
    }

    const product = await Product.findOne({ uuid });
    if (!product) {
      return next(new ErrorHandler(`Product not found`, 404));
    }

    const metadata: MetaData = {
      size: audioMetaData.fileSizeInMB,
      format: fileExtension,
      length: audioMetaData.durationInSeconds,
      bitrate: audioMetaData.bitrateInKbps,
    };

    const variants = [
      {
        metadata,
        key: `${uuid}/audio/${uuid}-original.${fileExtension}`,
      },
    ];
    product.variants.push(...variants);
    product.publicKey = `${uuid}/audio/${uuid}-watermarked.${fileExtension}`;
    product.thumbnailKey = `${uuid}/audio/${uuid}-watermarked.${fileExtension}`;

    const updatedProduct = await product.save();

    deleteLocalFile(originalAudioPath);
    deleteLocalFile(outputAudioPath);

    res.json({
      success: true,
      product: updatedProduct,
    });
  }
);
