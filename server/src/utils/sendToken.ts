// cratering token and saving in cookie
import config from "@src/utils/config.js"
const {nodeEnv}=config;
import { Response } from "express";


export default (user:any, statusCode:number, res:Response) => {
  const token = user.createJWT();
  // one day=24*60*60*1000
  const options = {
    httpOnly: nodeEnv === 'production',
    expires: new Date(Date.now() +  7*24*60*60*1000),
    secure: nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax' as 'none' | 'strict' | 'lax' | undefined,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
