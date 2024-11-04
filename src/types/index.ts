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
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrder {
	address: string;
	email: string;
	items: string[];
	payment: string;
	phone: string;
	total: number;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface ICatalogModel {
	items: Map<string, IProduct>;

	addItem(id: string, item: IProduct): void;

	setItems(items: Map<string, IProduct>): void;

	getProduct(id: string): IProduct;
}

export interface IView {
	render(data?: object): HTMLElement;
}
