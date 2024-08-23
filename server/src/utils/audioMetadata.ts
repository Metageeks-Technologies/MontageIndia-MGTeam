import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

interface AudioMetadata {
  durationInSeconds: number;
  bitrate: number;
  fileSizeInMB: number;
}

export function getAudioMetadata(
  originalAudioPath: string
): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(originalAudioPath, (err, metadata) => {
      if (err) {
        console.error("Error retrieving metadata:", err);
        return reject(new Error("Error retrieving audio metadata"));
      }

      const durationInSeconds = metadata.format.duration || 0;
      const bitrate = metadata.format.bit_rate
        ? parseInt(metadata.format.bit_rate.toString(), 10)
        : 0;
      const fileSizeInBytes = fs.statSync(originalAudioPath).size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      resolve({
        durationInSeconds,
        bitrate,
        fileSizeInMB: parseFloat(fileSizeInMB.toFixed(2)), // Keep two decimal points
      });
    });
  });
}
