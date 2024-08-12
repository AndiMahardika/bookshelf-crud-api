import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth.schema";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const {accessToken, refreshToken} = req.cookies

  // console.log(accessToken, refreshToken)
  if(!accessToken || !refreshToken){
    return res.status(401).json({ message: "Please re-login..." });
  }
  
  // if(accessToken){
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY as string);
      console.log(accessToken);
      next()
    } catch (error) {

      if (!refreshToken) {
        return res.status(401).json({ message: "Please re-login..." });
      }

      try {
        // Verifikasi Refresh Token
        console.log("Verifikasi Refresh Token");
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY as string);

        console.log("Cek Refresh token ada di database");
        const activeRefreshToken = await Auth.findOne({ refreshToken});
        // console.log(activeRefreshToken);

        if (!activeRefreshToken) {
          console.log("Refresh token tidak ada di database");
          return res.status(401).json({ message: "Please re-login..." });
        }

        const payload = jwt.decode(refreshToken) as { id: string; name: string; email: string };
        // console.log(payload);

        console.log("Bikin accessToken baru");
        const newAccessToken = jwt.sign(
          {
            id: payload.id,
            name: payload.name,
            email: payload.email
          },
          process.env.JWT_ACCESS_SECRET_KEY as string, 
          {expiresIn: "60s"}
        );

        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        next()
      } catch (error) {
        return res.status(401).json({ message: "Please re-login..." });
      }
    }
  // }    
}

export default authMiddleware;