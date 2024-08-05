import { Request, Response, NextFunction } from 'express';

const catchAsyncError = (
  asyncFun: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  customMessage?: string
) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(asyncFun(req, res, next)).catch((error) => {
    if (customMessage) {
      error.message = customMessage;
    }
    next(error);
  });
};

export default catchAsyncError;
