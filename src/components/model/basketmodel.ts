import { IBasketModel, IEventEmmiter } from '../../types';
import { CatalogModel } from "./catalogmodel";

export class BasketModel implements IBasketModel {
	constructor(protected events: IEventEmmiter) {}

	items: Map<string, number> = new Map();

	add(id: string): void {
		if (!this.items.has(id)) this.items.set(id, 0);
		this.items.set(id, this.items.get(id)! + 1);
		this._changed();
	}

	remove(id: string): void {
		if (!this.items.has(id)) return;
		if (this.items.get(id)! > 0) {
			this.items.set(id, this.items.get(id)! - 1);
			if (this.items.get(id) === 0) this.items.delete(id);
		}

		this._changed();
	}

	getPrice(catalogModel: CatalogModel): number {
		let price = 0;
		this.items.forEach((value, key): void => {
			price += value * catalogModel.getProduct(key).price;
		})
		return price;
	}

	protected _changed() {
		this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
	}
}
