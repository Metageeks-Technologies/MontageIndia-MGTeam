import {
  CreateJobCommand,
  ListJobsCommand,
  GetJobCommand,
} from "@aws-sdk/client-mediaconvert";
import { emcClient } from "@src/lib/awsClients";
import config from "@src/utils/config";

const {
  awsBucketName,
  awsMediaConvertQueue,
  awsMediaConvertRole,
  watermarkImgName,
} = config;

export const handleReduceVideos = async (inputFile: string, uuid: string) => {
  const destination = `s3://${awsBucketName}/${uuid}/video/`;
  const params: any = {
    Queue: awsMediaConvertQueue,
    UserMetadata: {},
    Role: awsMediaConvertRole,
    Settings: {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },

      OutputGroups: [
        {
          Name: "File Group",
          Outputs: [
            {
              Preset:
                "System-Generic_Hd_Mp4_Av1_Aac_16x9_1920x1080p_30Hz_5Mbps_Qvbr_Vq7",
              Extension: ".mp4",
              NameModifier: "-original",
            },
          ],

          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: destination,
            },
          },
        },
        {
          Name: "File Group",
          Outputs: [
            {
              Preset:
                "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_24Hz_2Mbps_Qvbr_Vq7",
              Extension: ".mp4",
              NameModifier: "-medium",
            },
          ],

          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: destination,
            },
          },
        },
        {
          Name: "File Group",
          Outputs: [
            {
              Preset: "System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps",
              Extension: ".webm",
              NameModifier: "-thumbnail",
            },
          ],

          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: destination,
            },
          },
        },
      ],
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
          FileInput: inputFile,
        },
      ],
    },
    AccelerationSettings: {
      Mode: "DISABLED",
    },
    StatusUpdateInterval: "SECONDS_60",
    Priority: 0,
  };

  try {
    const data = await emcClient.send(new CreateJobCommand(params));

    return data.Job?.Id;
  } catch (err) {
    console.log("Error", err);
  }
};

export const handleVideoWithWaterMark = async (
  inputFile: string,
  uuid: string
) => {
  const destination = `s3://${awsBucketName}/${uuid}/video/`;
  const params: any = {
    Queue: awsMediaConvertQueue,
    UserMetadata: {},
    Role: awsMediaConvertRole,
    Settings: {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      OutputGroups: [
        {
          Name: "File Group",
          Outputs: [
            {
              Preset:
                "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
              Extension: ".webm",
              NameModifier: "-product_page",
            },
          ],

          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: destination,
            },
          },
        },
      ],
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
          ImageInserter: {
            InsertableImages: [
              {
                ImageX: 320,
                ImageY: 240,
                Layer: 1,
                ImageInserterInput: `s3://${awsBucketName}/${watermarkImgName}`,
                Opacity: 50,
              },
            ],
          },
          FileInput: inputFile,
        },
      ],
    },
    AccelerationSettings: {
      Mode: "DISABLED",
    },
    StatusUpdateInterval: "SECONDS_60",
    Priority: 1,
  };
  try {
    const data = await emcClient.send(new CreateJobCommand(params));

    return data.Job?.Id;
  } catch (err) {
    console.log("Error", err);
  }
};

export const getTranscodeStatus = async (jobId: string) => {
  const input: any = {
    Id: jobId,
  };

  console.log(input);

  try {
    const data = await emcClient.send(new GetJobCommand(input));
    console.log(data);

    return {
      status: data.Job?.Status,
      completePercentage: data.Job?.JobPercentComplete,
    };
  } catch (err) {
    console.log("Error", err);
  }
};
