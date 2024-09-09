import {
  CreateJobCommand,
  ListJobsCommand,
  GetJobCommand,
  CreateJobCommandInput,
} from "@aws-sdk/client-mediaconvert";
import { emcClient } from "@src/lib/awsClients";
import config from "@src/utils/config";

const {
  awsBucketName,
  awsMediaConvertQueue,
  awsMediaConvertRole,
  watermarkImgName,
  watermarkWidth,
  watermarkHeight,
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
    Priority: 2,
  };

  try {
    const data = await emcClient.send(new CreateJobCommand(params));

    return data.Job?.Id;
  } catch (err) {
    console.log("Error", err);
  }
};

export const handleReduceThumbnail = async (
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
          // Outputs: [
          //   {
          //     Preset: "System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps",
          //     Extension: ".webm",
          //     NameModifier: "-thumbnail",
          //   },
          // ],
          Outputs: [
            {
              ContainerSettings: {
                Container: "WEBM",
                WebmSettings: {},
              },
              VideoDescription: {
                Width: 640,
                CodecSettings: {
                  Codec: "VP9",
                  Vp9Settings: {
                    Bitrate: 1500000,
                    RateControlMode: "VBR",
                  },
                },
              },
              AudioDescriptions: [
                {
                  CodecSettings: {
                    Codec: "OPUS",
                    OpusSettings: {
                      Bitrate: 96000,
                      Channels: 2,
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              NameModifier: "-thumbnail",
              Extension: ".webm",
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
          InputClippings: [
            {
              StartTimecode: "00:00:00:00",
              EndTimecode: "00:00:10:00",
            },
          ],
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
  uuid: string,
  width?: number,
  height?: number
) => {
  const destination = `s3://${awsBucketName}/${uuid}/video/`;

  if (!width || !height) return;
  const centerX = (width - watermarkWidth) / 2;
  const centerY = (height - watermarkHeight) / 2;

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
          // Outputs: [
          //   {
          //     Preset:
          //       "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
          //     Extension: ".webm",
          //     NameModifier: "-product_page",
          //   },
          // ],
          Outputs: [
            {
              ContainerSettings: {
                Container: "WEBM",
                WebmSettings: {},
              },
              VideoDescription: {
                Width: 1280,
                CodecSettings: {
                  Codec: "VP9",
                  Vp9Settings: {
                    Bitrate: 1500000,
                    RateControlMode: "VBR",
                  },
                },
              },
              AudioDescriptions: [
                {
                  CodecSettings: {
                    Codec: "OPUS",
                    OpusSettings: {
                      Bitrate: 96000,
                      Channels: 2,
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              NameModifier: "-product_page",
              Extension: ".webm",
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
                ImageX: centerX > 0 ? centerX : 320,
                ImageY: centerY > 0 ? centerY : 240,
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

  // console.log(input);

  try {
    const data = await emcClient.send(new GetJobCommand(input));
    // console.log(data);

    return {
      status: data.Job?.Status,
      completePercentage: data.Job?.JobPercentComplete,
    };
  } catch (err) {
    console.log("Error", err);
  }
};
