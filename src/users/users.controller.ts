import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { BaseCotroller } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { IUserController } from './users.controller.interface';
import { ILogger } from '../logger/logger.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { TYPES } from '../types';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './users.service.interface';
import { AuthGuard } from '../common/auth.guard';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersController extends BaseCotroller implements IUserController {
	private routes: IControllerRoute[] = [
		{
			func: this.login,
			method: 'post',
			path: '/login',
			middleware: [new ValidateMiddleware(UserLoginDto)],
		},
		{
			func: this.registration,
			method: 'post',
			middleware: [new ValidateMiddleware(UserRegistrationDto)],
			path: '/registration',
		},
		{
			func: this.info,
			method: 'get',
			middleware: [new AuthGuard()],
			path: '/info',
		},
	];

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes(this.routes);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации'));
		}
		const jwt = await this.singJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async registration(
		{ body }: Request<{}, {}, UserRegistrationDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.send(res, 201, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private singJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign({
				email,
				iat: Math.floor(Date.now() / 1000)
			},
				secret,
				{ algorithm: "HS256" },
				(error, token) => {
					if (error) {
						reject(error);
					}
					resolve(token as string);
				})
		})
	}
}

