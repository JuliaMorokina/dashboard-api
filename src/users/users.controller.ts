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
			path: '/registration',
		},
	];

	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password);
		this.send(res, 201, newUser);
	}
}
