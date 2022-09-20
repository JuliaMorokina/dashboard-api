import { NextFunction, Request, Response, Router } from "express";

export interface IControllerRoute {
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, "get" | "post" | "delete" | "put" | "patch">;
  path: string;
}
