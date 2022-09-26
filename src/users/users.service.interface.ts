import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { User } from './user.entity';

export interface IUserService {
	createUser: (dto: UserRegistrationDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
