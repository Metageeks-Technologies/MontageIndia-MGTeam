import express, { Express } from 'express';
import 'module-alias/register';
import adminRouter from './routes/user/admin.js';
import imageRouter from './routes/media/img.js';
import connectDB from './utils/connectDb.js';
import cors from 'cors'
import morgan from 'morgan'
import videoRouter from './routes/media/video.js';
import audioRouter from './routes/media/audio.js';
import errorMiddleware from './middleware/error.js';
import {processSQSMessages} from "@src/lib/sqsQueue.js"
import config from "@src/utils/config.js"
import productRouter from "@src/routes/product/product"
const {mongoUrl}=config;

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/media/image", imageRouter);
app.use("/api/v1/media/video", videoRouter);
app.use("/api/v1/media/audio", audioRouter);
app.use("/api/v1/product", productRouter);


app.use(errorMiddleware);
// processSQSMessages();

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(mongoUrl);
      app.listen(port, () =>
        console.log(
          `⚡️[server]: Server iS running at http://localhost:${port} as well as connected with database`
        )
      );
  } catch (error) {
    console.log(error);
  }
};
start();