import { hash } from 'bcryptjs';

export class User {
	private _passwors: string;
	constructor(private readonly _email: string, private readonly _name: string) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._passwors;
	}

	public async setPassword(pass: string): Promise<void> {
		this._passwors = await hash(pass, 10);
	}
}
