import express, { Express } from "express";
import { Server } from "http";
import { ExeptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UsersController } from "./users/users.controller";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: LoggerService;
  usersController: UsersController;
  exeptionFilter: ExeptionFilter;

  constructor(
    logger: LoggerService,
    usersController: UsersController,
    exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.usersController = usersController;
    this.exeptionFilter = exeptionFilter;
  }

  useRoutes() {
    this.app.use("/users", this.usersController.router);
  }

  useExeptionsFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionsFilters();
    this.server = this.app.listen(this.port);
    this.logger.log("server listeting");
  }
}
