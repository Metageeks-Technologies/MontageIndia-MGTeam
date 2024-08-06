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
import subscriptionRouter from '@src/routes/subscription/subscription';
import userRouter from './routes/user/customer';
const {mongoUrl,nodeEnv}=config;
 
const app: Express = express();
// app.use(cors({
//   origin:nodeEnv==="production"?"https://montage-india-mg-team.vercel.app":"http://localhost:3000", 
//   credentials: true 
// }));
// const allowedOrigins = ['https://montage-india-mg-team.vercel.app'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       console.log(origin)
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
// temp
const allowedOrigins = ['https://montage-india-mg-team.vercel.app'];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || allowedOrigins.includes(origin) || (nodeEnv !== 'production' && origin === 'http://localhost:3000')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));


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
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/field", fieldRouter);


app.get("/api/greet", (req,res,next)=>{
  res.send("Hello from server..")
});

// dummy ci-cd commit 
app.use(errorMiddleware);
processSQSMessages();

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