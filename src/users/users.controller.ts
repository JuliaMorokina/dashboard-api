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

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'Success');
	}

	registration(req: Request<{}, {}, UserRegistrationDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.send(res, 201, 'Success registration');
	}
}
