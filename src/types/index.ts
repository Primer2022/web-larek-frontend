export interface IBasketModel {
	items: Map<string, number>;

	add(id: string): void;

	remove(id: string): void;
}

export interface IEventEmmiter {
	emit: (event: string, data: unknown) => void;
}

export interface IProduct {
	id: string;
	title: string;
	category: string;
	image: string;
	price: string;
}

export interface IOrder {
	payMethod: string;
	address: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface ICatalogModel {
	items: Map<string, IProduct>;

	setItems(items: Map<string, IProduct>): void;

	getProduct(id: string): IProduct;
}

export interface IView {
	render(data?: object): HTMLElement;
}
