import express, { Express } from 'express';
import { json } from 'body-parser';
import { inject, injectable } from 'inversify';
import { Server } from 'http';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { UsersController } from './users/users.controller';
import { TYPES } from './types';
import 'reflect-metadata';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { ConfigService } from './config/config.service';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: UsersController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ConfigService) private configService: ConfigService
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
	}

	useExeptionsFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionsFilters();
		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log('server listeting');
	}
}

