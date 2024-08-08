export type TConfig ={
    port: string;
    mongoUrl: string;
    jwtSecret: string;
    jwtLifetime: string;
    nodeEnv: string;
    watermarkImgName: string;
    awsRegion: string;
    awsAccessKey: string;
    awsSecretKey: string;
    awsBucketName: string;
    awsMediaConvertRole: string;
    awsMediaConvertQueue: string;
    awsSqsQueueUrl: string;
    awsTempBucketName:string;
    clientUrl:string;
  }