// cratering token and saving in cookie
import { Response } from "express";
import config from "@src/utils/config";
export default (user:any, statusCode:number, res:Response) => {
  const token = user.createJWT();
  // one day=24*60*60*1000
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() +  24*60*60*1000),
    secure: config.nodeEnv === 'production',
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
