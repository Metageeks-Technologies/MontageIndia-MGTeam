import express from 'express';
import { reduceImage } from '@src/controller/media/img';
import multer from 'multer'
import ErrorHandler from '@src/utils/errorHandler';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/'); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
const upload = multer({ storage: storage });
const imageRouter = express.Router();

imageRouter.route("/reduce").post(upload.array('image'), reduceImage);
imageRouter.route("/temp").get(async(req,res,next)=>{
    try {
        if(true){
            throw Error("this is an error....")
        }
    } catch (error:any) {
        next(new ErrorHandler(error.message,400))
    }
})


export default imageRouter;
