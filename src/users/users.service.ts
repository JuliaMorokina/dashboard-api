import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegistrationDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
