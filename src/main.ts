import { Container } from "inversify";
import { App } from "./app";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";
import { UsersController } from "./users/users.controller";
import { TYPES } from "./types";

const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
appContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };
