import { IContacts } from '../../types';

export class ContactsModel implements IContacts {
	email: string;
	phone: string;

	constructor(email: string, phone: string) {
		this.email = email;
		this.phone = phone;
	}
}
