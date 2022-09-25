import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseCotroller } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";

@injectable()
export class UsersController extends BaseCotroller {
  private routes: IControllerRoute[] = [
    {
      func: this.login,
      method: "post",
      path: "/login"
    },
    {
      func: this.registration,
      method: "post",
      path: "/registration"
    }
  ];

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);
    this.bindRoutes(this.routes);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "Success");
  }

  registration(req: Request, res: Response, next: NextFunction) {
    this.send(res, 201, "Success registration");
  }
}
