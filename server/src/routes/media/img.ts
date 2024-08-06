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
const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (req, file, cb) => {
        // You can add additional file type validation here if needed
        cb(null, true);
    }
});
const imageRouter = express.Router();

imageRouter.route("/reduce").post(upload.single('image'), reduceImage);




export default imageRouter;
