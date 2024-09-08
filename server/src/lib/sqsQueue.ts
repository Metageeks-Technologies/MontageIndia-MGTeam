import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import type { S3Event } from "aws-lambda";
import {
  handleReduceVideos,
  handleVideoWithWaterMark,
} from "@src/lib/resizeVideo";
import { sqsClient } from "@src/lib/awsClients";
import config from "@src/utils/config";
import EmcMedia from "@src/model/product/emcJob";
import Product from "@src/model/product/product";

const { awsSqsQueueUrl } = config;

const receiveMessage = (queueUrl: string) =>
  sqsClient.send(
    new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: queueUrl,
      WaitTimeSeconds: 20,
    })
  );

const deleteMessage = async (queueUrl: string, receiptHandle: string) => {
  const input = {
    QueueUrl: queueUrl, // required
    ReceiptHandle: receiptHandle, // required
  };
  const command = new DeleteMessageCommand(input);
  const response = await sqsClient.send(command);
};

export const processSQSMessages = async () => {
  while (true) {
    const { Messages } = await receiveMessage(awsSqsQueueUrl);
    if (!Messages) {
      console.log("No Message in Queue");
      continue;
    }

    try {
      for (const message of Messages) {
        const { MessageId, Body, ReceiptHandle } = message;
        if (!Body || !ReceiptHandle) continue;
        const event = JSON.parse(Body) as S3Event;
        if ("Service" in event && "Event" in event) {
          if (event.Event === "s3:TestEvent") continue;
        }
        console.log("in the prosess");
        for (const record of event.Records) {
          const {
            bucket,
            object: { key },
          } = record.s3;
          console.log(bucket);
          const inputFile = `s3://${bucket.name}/${key}`;
          const keyArr = key.split(".");
          keyArr.pop();
          const uuid = keyArr.join(".");
          const isJobExist = await EmcMedia.findOne({ uuid });
          if (isJobExist) continue;
          const product = await Product.findOne({ uuid });
          if (!product) continue;
          const watermarkJobId = await handleVideoWithWaterMark(
            inputFile,
            uuid,
            product?.width,
            product?.height
          );
          const mainJobId = await handleReduceVideos(inputFile, uuid);
          await EmcMedia.create({
            mainJobId,
            watermarkJobId,
            uuid,
            product: product._id,
          });
          await deleteMessage(awsSqsQueueUrl, ReceiptHandle);
        }
      }
    } catch (error: any) {
      console.log(
        `Error processing messages: ${"message" in error && error.message}`
      );
    }
  }
};
