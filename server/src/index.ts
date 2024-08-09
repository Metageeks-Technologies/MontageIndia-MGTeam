import express, { Express } from 'express';
import 'module-alias/register';
import adminRouter from '@src/routes/user/admin.js';
import imageRouter from '@src/routes/media/img.js';
import connectDB from '@src/utils/connectDb.js';
import cors from 'cors'
import morgan from 'morgan'
import videoRouter from '@src/routes/media/video.js';
import audioRouter from '@src/routes/media/audio.js';
import errorMiddleware from '@src/middleware/error.js';
import {processSQSMessages} from "@src/lib/sqsQueue.js"
import config from "@src/utils/config.js"
import productRouter from "@src/routes/product/product"
import fieldRouter from '@src/routes/field/field';
import cookieParser from 'cookie-parser';
import paymentRouter from '@src/routes/payment/payment';
import userRouter from './routes/user/customer';
import router from './routes/product/order';
const {mongoUrl}=config;
 
const app: Express = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));
app.enable("trust proxy");
app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(express.urlencoded({limit: "500mb" ,extended: true }));
app.use(morgan('dev'));

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media/image", imageRouter);
app.use("/api/v1/media/video", videoRouter);
app.use("/api/v1/media/audio", audioRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/field", fieldRouter);

app.use("/api/v1", router);


app.get("/api/greet", (req,res,next)=>{
  res.send("Hello from server..")
});

// dummy ci-cd commit 
app.use(errorMiddleware);
processSQSMessages();

const port = config.port || 5000;
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