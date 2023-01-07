import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('Users Service', () => {
	it('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				email: user.email,
				name: user.name,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'v@v.ru',
			name: 'Jane',
			password: '123',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', () => {
		usersRepository.find = jest.fn().mockRejectedValueOnce(createdUser);
		const res = userService
			.validateUser({
				email: 'v@v.ru',
				password: '123',
			})
			.catch(() => {
				return false;
			});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockRejectedValueOnce(createdUser);
		const res = await userService
			.validateUser({
				email: 'v@v.ru',
				password: '2',
			})
			.catch(() => {
				return false;
			});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockRejectedValueOnce(null);
		const res = await userService
			.validateUser({
				email: 'v2@v.ru',
				password: '1',
			})
			.catch(() => {
				return false;
			});
		expect(res).toBeFalsy();
	});
});
