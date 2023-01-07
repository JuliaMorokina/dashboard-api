import { compare, hash } from 'bcryptjs';

export class User {
	private _passwors: string;
	constructor(private readonly _email: string, private readonly _name: string, passHash?: string) {
		if (passHash) {
			this._passwors = passHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._passwors;
	}

	public async setPassword(pass: string, salt: string): Promise<void> {
		this._passwors = await hash(pass, Number(salt));
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._passwors);
	}
}
