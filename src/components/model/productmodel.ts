import { IProduct } from '../../types';

export class ProductModel implements IProduct {
	id: string;
	title: string;
	category: string;
	image: string;
	price: string;

	constructor(
		id: string,
		title: string,
		category: string,
		image: string,
		price: string
	) {
		this.id = id;
		this.title = title;
		this.category = category;
		this.image = image;
		this.price = price;
	}
}
