import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { IMiddleware } from "./middleware.interface";


export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}
  execute(req: Request, res: Response, next: NextFunction): void {
    if(req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      verify(token, this.secret, (err, payload) => {
        if(err) {
          next();
        }
        if(payload) {
          req.user = typeof payload !== 'string' ? payload.email : "";
          next()
        }
      })
    } else {
      next();
    }
  }
}