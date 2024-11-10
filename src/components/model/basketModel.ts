import {
	IBasketListItem,
	IBasketModel,
	IEventEmmiter,
	IProduct,
} from '../../types';
import { CatalogModel } from './catalogModel';
import { BasketItemView } from "../view/basketItemView";

export class BasketModel implements IBasketModel {
	constructor(protected events: IEventEmmiter) {}

	items: Map<string, IBasketListItem> = new Map();
	itemsView: Map<string, BasketItemView> = new Map();

	add(product: IProduct): void {
		const id = product.id;
		if (!this.items.has(id))
			this.items.set(id, { product: product, price: product.price, amount: 0 });
		const basketListItem = this.items.get(id);
		basketListItem.amount += 1;
		this.items.set(id, basketListItem);
		this._changed();
	}

	remove(id: string): void {
		if (!this.items.has(id)) return;
		const basketListItem = this.items.get(id);
		if (basketListItem.amount! > 0) {
			basketListItem.amount -= 1;
			this.items.set(id, basketListItem);
			if (basketListItem.amount === 0) this.items.delete(id);
		}

		this._changed();
	}

	getBasketPrice(catalogModel: CatalogModel): number {
		let price = 0;
		this.items.forEach((value, key): void => {
			price += value.amount * catalogModel.getProduct(key).price;
		});
		return price;
	}

	protected _changed() {
		this.events.emit('basket:change', { items: Array.from(this.items.keys()) });
	}
}
