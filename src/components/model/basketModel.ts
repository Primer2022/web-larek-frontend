import { IBasketModel, IEventEmmiter, IProduct } from "../../types";
import { CatalogModel } from './catalogModel';

export class BasketModel implements IBasketModel {
	constructor(protected events: IEventEmmiter) {}

	items: string[] = [];

	add(id: string): void {
		if (!this.items.includes(id)) this.items.push(id);
		this._changed();
	}

	remove(id: string): void {
		const index = this.items.indexOf(id);
		if (index !== -1) {
			this.items.splice(index, 1);
			this._changed();
		}
	}

	getBasketPrice(catalogModel: CatalogModel): number {
		let price = 0;
		this.items.forEach((id: string) => {
			price += catalogModel.getProduct(id).price;
		})
		return price;
	}

	protected _changed() {
		this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
	}
}
