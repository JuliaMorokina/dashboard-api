import express, { Express } from "express";
import { Server } from "http";
import { userRouter } from "./users/users.js";

export class App {
  app: Express;
  port: number;
  server: Server;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use("/users", userRouter);
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    console.log("server listeting");
  }
}
