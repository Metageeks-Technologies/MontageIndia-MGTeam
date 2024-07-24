import { CreateJobCommand, ListJobsCommand } from "@aws-sdk/client-mediaconvert";
import { emcClient } from "@src/lib/awsClients";
import config from "@src/utils/config";

const {awsBucketName,awsMediaConvertQueue,awsMediaConvertRole,watermarkImgName}=config;

export const handleReduceVideos =async (inputFile: string) => {
    const params:any = {
        Queue: awsMediaConvertQueue,
        UserMetadata: {},
        Role:awsMediaConvertRole,
        Settings: {
            TimecodeConfig: {
                Source: "ZEROBASED"
            },
            OutputGroups: [
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Uhd_Mp4_Hevc_Aac_16x9_3840x2160p_24Hz_8Mbps",
                            "Extension": ".mp4",
                            "NameModifier": "-Original"
                        },
                    ],

                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: `s3://${awsBucketName}/Video/Original/`
                        }
                    }
                },
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1920x1080p_30Hz_5Mbps_Qvbr_Vq7",
                            "Extension": ".mp4",
                            "NameModifier": "-Medium"
                        },
                    ],

                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: `s3://${awsBucketName}/Video/Medium/`
                        }
                    }
                },
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
                            "Extension": ".mp4",
                            "NameModifier": "-Small"
                        },
                    ],

                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: `s3://${awsBucketName}/Video/Small/`
                        }
                    }
                },
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps",
                            "Extension": ".webm",
                            "NameModifier": "-Thumbnail"
                        },
                    ],

                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination:`s3://${awsBucketName}/Video/Thumbnail/`
                        }
                    }
                }
            ],
            Inputs: [
                {
                    AudioSelectors: {
                        "Audio Selector 1": {
                            "DefaultSelection": "DEFAULT"
                        }
                    },
                    VideoSelector: {},
                    TimecodeSource: "ZEROBASED",
                    FileInput:inputFile
                }
            ]
        },
        AccelerationSettings: {
            Mode: "DISABLED"
        },
        StatusUpdateInterval: "SECONDS_60",
        Priority: 0
    }

    try {
        const data = await emcClient.send(new CreateJobCommand(params));
        console.log("Job created!", data);
        return data;
      } catch (err) {
        console.log("Error", err);
    }
    
};

export const handleVideoWithWaterMark = async (inputFile: string) => {

    const params:any = {
        Queue: awsMediaConvertQueue,
        UserMetadata: {},
        Role: awsMediaConvertRole,
        Settings: {
            TimecodeConfig: {
                Source: "ZEROBASED"
            },
            OutputGroups: [
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
                            "Extension": ".webm",
                            "NameModifier": "-ProductPage",
                        },
                    ],

                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination:`s3://${awsBucketName}/Video/ProductPage/`
                        }
                    }
                }
            ],
            Inputs: [
                {
                    AudioSelectors: {
                        "Audio Selector 1": {
                            "DefaultSelection": "DEFAULT"
                        }
                    },
                    VideoSelector: {},
                    TimecodeSource: "ZEROBASED",
                    ImageInserter: {
                        InsertableImages: [
                            {
                                "ImageX": 320,
                                "ImageY": 240,
                                "Layer": 1,
                                "ImageInserterInput": `s3://${awsBucketName}/${watermarkImgName}`,
                                "Opacity": 50
                            }
                        ]
                    },
                    FileInput: inputFile
                }
            ]
        },
        AccelerationSettings: {
            Mode: "DISABLED"
        },
        StatusUpdateInterval: "SECONDS_60",
        Priority: 1
    }
    try {
        const data = await emcClient.send(new CreateJobCommand(params));
        console.log("Job created!", data);
        return data;
      } catch (err) {
        console.log("Error", err);
    }

}

export const getTranscodeProgress =async ()=>{
    const params:any = {
        MaxResults: 10,
        Order: "ASCENDING",
        Queue: awsMediaConvertQueue,
        Status: "PROGRESSING",
      };

      try {
        const data = await emcClient.send(new ListJobsCommand(params));
        console.log("Success. Jobs: ", data.Jobs);
        return data;
      } catch (err) {
        console.log("Error", err);
      }
}



// export const getTranscodeProgress = (JobId: string): Promise<{ jobStatus: string; jobProgress: number }> => {
//     return new Promise((resolve, reject) => {
//         mediaconvert.getJob({ Id: JobId }, (err, data) => {
//             if (err) {
//                 console.error("Error while getting the job", err);
//                 reject(err); // Reject the Promise in case of an error
//             } else {

//                 const jobStatus = data?.Job?.Status;
//                 const jobProgress = data?.Job?.JobPercentComplete || -1;
//                 console.log({ jobStatus, jobProgress });
//                 if (jobStatus) {
//                     resolve({ jobStatus, jobProgress }); // Resolve the Promise with the result
//                 } else {
//                     reject(new Error("Job status or progress not available."));
//                 }
//             }
//         });
//     });
// };






