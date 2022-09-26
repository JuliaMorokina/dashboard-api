import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseCotroller } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { IUserController } from './users.controller.interface';
import { ILogger } from '../logger/logger.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { TYPES } from '../types';
import 'reflect-metadata';
import { User } from './user.entity';
import { UserService } from './users.service';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseCotroller implements IUserController {
	private routes: IControllerRoute[] = [
		{
			func: this.login,
			method: 'post',
			path: '/login',
		},
		{
			func: this.registration,
			method: 'post',
			middleware: [new ValidateMiddleware(UserRegistrationDto)],
			path: '/registration',
		},
	];

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes(this.routes);
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		this.ok(res, 'Success');
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
		this.send(res, 201, { email: result.email });
	}
}
