import instance from "@/utils/axios";
import { notifyError, notifySuccess } from "@/utils/toast";
import React, { useState, useCallback, useMemo } from "react";
import { Accept, useDropzone } from "react-dropzone";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import Swal from "sweetalert2";

interface FormData {
  product: {
    uuid: string;
    mediaType: "image" | "audio" | "video";
    title: string;
  };
}

interface Form2Props {
  onPrev: () => void;
  onNext: (data: any) => void;
  formData: FormData;
}

const Form2: React.FC<Form2Props> = ({ onPrev, onNext, formData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPer, setLoadingPer] = useState(0);
  const [videoDuration, setVideoDuration] = useState<null | number>(null);

  const data = formData?.product || {};

  const validateFileType = useCallback(
    (fileType: string): boolean => {
      if (!data.mediaType) return true;
      const mediaTypeMap: Record<string, string> = {
        image: "image/",
        audio: "audio/",
        video: "video/",
      };
      return fileType.startsWith(mediaTypeMap[data.mediaType] || "");
    },
    [data.mediaType]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        if (validateFileType(selectedFile.type)) {
          if (selectedFile.type.startsWith("video/")) {
            const videoElement = document.createElement("video");
            videoElement.preload = "metadata";

            // Create a temporary URL for the video file
            const videoURL = URL.createObjectURL(selectedFile);
            videoElement.src = videoURL;
            console.log(videoElement.duration, "duration");

            // Once metadata is loaded, extract the duration
            videoElement.onloadedmetadata = () => {
              setVideoDuration(videoElement.duration); // Duration in seconds

              // Clean up the object URL
              URL.revokeObjectURL(videoURL);
            };
          }
          setFile(selectedFile);
          setError("");
        } else {
          setError(`Please select a valid ${data.mediaType} file.`);
        }
      }
    },
    [data.mediaType, validateFileType]
  );

  const acceptableFileTypes: Accept = useMemo(() => {
    const typeMap: Record<string, Record<string, string[]>> = {
      image: { "image/*": [".jpeg", ".jpg", ".png"] },
      audio: { "audio/*": [".mp3", ".wav"] },
      video: { "video/*": [".mp4", ".avi"] },
    };
    return data.mediaType ? typeMap[data.mediaType] : {};
  }, [data.mediaType]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptableFileTypes,
    maxFiles: 1,
  });

  const handleImageSubmit = async (file: File, data: any) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("uuid", JSON.stringify(data.uuid));
    formData.append("mediaType", JSON.stringify(data.mediaType));

    const url = `/media/image/reduce`;

    try {
      const response = await instance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLoadingPer(percentCompleted);
          }
        },
      });
      if (response.status === 200) {
        notifySuccess("Image upload successful");
        onNext(response.data);
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleAudioSubmit = async (file: File, data: any) => {
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("uuid", JSON.stringify(data.uuid));
    formData.append("mediaType", JSON.stringify(data.mediaType));

    const url = `/media/audio/reduce`;
    try {
      const response = await instance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLoadingPer(percentCompleted);
          }
        },
      });
      if (response.status === 200) {
        notifySuccess("Audio file upload successful");
        onNext(response.data);
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleVideoSubmit = async (file: File, data: any) => {
    if (!file || !data || !data.uuid) {
      setError("Invalid input data.");
      return;
    }

    try {
      // Initiate the upload process
      const length = videoDuration ? videoDuration : 0;
      const response = await instance(
        `/media/video/upload?uuid=${data.uuid}&filename=${file.name}&length=${length}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to initiate the upload process.");
      }

      // Upload the video file
      const uploadRes = await axios.put(response.data.url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLoadingPer(percentCompleted);
          }
        },
      });

      if (uploadRes.status !== 200) {
        throw new Error("Failed to upload the video file.");
      }

      // Get the job IDs
      const pollInterval = 5000;
      const maxPollTime = 120000;
      let elapsedTime = 0;
      let emcMediaJob = null;

      while (elapsedTime < maxPollTime) {
        const jobResponse = await instance(
          `/media/video/job-id/?uuid=${data.uuid}`
        );
        emcMediaJob = jobResponse.data.emcMediaJob;
        if (emcMediaJob) break;
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        elapsedTime += pollInterval;
      }

      if (!emcMediaJob) {
        throw new Error("Timeout: mcMediaJob not found");
      }

      const { mainJobId, watermarkJobId } = emcMediaJob;

      // Poll for transcoding progress
      const id = setInterval(async () => {
        try {
          const res = await instance(
            `/media/video/transcode/progress/?watermarkJobId=${watermarkJobId}&mainJobId=${mainJobId}`
          );

          if (res.data.process.status === "complete") {
            clearInterval(id);
            const productRes = await instance.patch(`/product/video/`, {
              uuid: data.uuid,
              mediaType: "video",
            });
            notifySuccess("Video upload and processing complete");
            onNext(productRes.data);
          }
        } catch (error) {
          clearInterval(id);
          handleError(error);
        }
      }, 10000);
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    const errorMessage =
      error.response?.data?.message ||
      `An error occurred while uploading the ${data.mediaType}.`;
    notifyError(errorMessage);
    setError(errorMessage);
    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: errorMessage,
    });
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    switch (data.mediaType) {
      case "image":
        await handleImageSubmit(file, data);
        break;
      case "audio":
        await handleAudioSubmit(file, data);
        break;
      case "video":
        await handleVideoSubmit(file, data);
        break;
      default:
        setError("Invalid media type.");
        setLoading(false);
    }
  };

  const acceptedFileTypes: Record<string, string> = {
    audio: "MP3, WAV",
    image: "PNG, JPG, JPEG",
    video: "MP4, AVI",
  };
  const displayPercentage = loadingPer >= 98 ? 98 : loadingPer;
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mt-10">
      {loading ? (
        <div className="items-center flex justify-center h-screen">
          <Spinner
            label={`Uploading...${displayPercentage}%`}
            color="success"
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Upload {data.mediaType}
          </h2>
          <div
            {...getRootProps()}
            className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 mb-4"
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <p className="mb-2">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-sm text-gray-500">
                Accepted file types:{" "}
                {acceptedFileTypes[data.mediaType] || "Any file"}
              </p>
              {file && <p className="mt-2 font-semibold">{file.name}</p>}
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className={`p-2 px-4 font-semibold text-white rounded-lg ${
              file
                ? "bg-lime-500 hover:bg-lime-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!file || loading}
          >
            Upload and Continue
          </button>
        </>
      )}
    </div>
  );
};

export default Form2;
