import { IProduct } from '../../types';

export class ProductModel implements IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;

	constructor(
		id: string,
		description: string,
		image: string,
		title: string,
		category: string,
		price: number
	) {
		this.id = id;
		this.description = description;
		this.image = image;
		this.title = title;
		this.category = category;
		this.price = price;
	}
}
