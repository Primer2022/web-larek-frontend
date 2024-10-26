import { ICatalogModel, IEventEmmiter, IProduct } from '../../types';

export class CatalogModel implements ICatalogModel {
	constructor(protected events: IEventEmmiter) {}

	items: Map<string, IProduct> = new Map();

	addItem(id: string, item: IProduct): void {
		this.items.set(id, item);
		this._changed()
	}

	setItems(items: Map<string, IProduct>): void {
		this.items = items;
		this._changed();
	}

	getProduct(id: string): IProduct {
		return this.items.get(id);
	}

	protected _changed() {
		this.events.emit('catalog:change', {
			items: Array.from(this.items.keys()),
		});
	}
}
