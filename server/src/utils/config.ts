import dotenv from "dotenv";
import type { TConfig } from "@src/types/envConfig";
dotenv.config();

const getEnvVariable = (name: string, required = true): string => {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value || "";
};

const config: TConfig = {
  port: getEnvVariable("PORT"),
  mongoUrl: getEnvVariable("MONGO_URL"),
  jwtSecret: getEnvVariable("JWT_SECRET"),
  jwtLifetime: getEnvVariable("JWT_LIFETIME"),
  nodeEnv: getEnvVariable("NODE_ENV"),
  watermarkImgName: getEnvVariable("WATERMARK_IMG_NAME"),
  watermarkWidth: Number(getEnvVariable("WATERMARK_IMG_WIDTH")),
  watermarkHeight: Number(getEnvVariable("WATERMARK_IMG_HEIGHT")),
  awsRegion: getEnvVariable("AWS_REGION"),
  awsAccessKey: getEnvVariable("AWS_ACCESS_KEY"),
  awsSecretKey: getEnvVariable("AWS_SECRET_KEY"),
  awsBucketName: getEnvVariable("AWS_BUCKET_NAME"),
  awsMediaConvertRole: getEnvVariable("AWS_MEDIA_CONVERT_ROLE"),
  awsMediaConvertQueue: getEnvVariable("AWS_MEDIA_CONVERT_QUEUE"),
  awsSqsQueueUrl: getEnvVariable("AWS_SQS_QUEUE_URL"),
  awsTempBucketName: getEnvVariable("AWS_TEMP_BUCKET_NAME"),
  emailUser: getEnvVariable("EMAIL_USER"),
  emailPass: getEnvVariable("EMAIL_PASS"),
  clientUrl: getEnvVariable("CLIENT_URL"),
  razorpayKey: getEnvVariable("RAZORPAY_KEY"),
  razorpaySecret: getEnvVariable("RAZORPAY_SECRET"),
  customerJwtSecret: getEnvVariable("JWT_SECRET_CUSTOMER"),
  razorpayWebhookSecret: getEnvVariable("RAZORPAY_WEBHOOK_SECRET"),
  montageEmail: getEnvVariable("MONTAGE_EMAIL"),
};

export default config;
