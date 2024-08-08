import { IOrder } from '../../types';

export class OrderModel implements IOrder {
	payMethod: string;
	address: string;

	constructor(payMethod: string, address: string) {
		this.payMethod = payMethod;
		this.address = address;
	}
}
