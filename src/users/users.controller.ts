import { NextFunction, Request, Response } from "express";
import { BaseCotroller } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { HTTPError } from "../errors/http-error.class";
import { LoggerService } from "../logger/logger.service";

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

  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes(this.routes);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, "Success");
  }

  registration(req: Request, res: Response, next: NextFunction) {
    this.send(res, 201, "Success registration");
  }
}
