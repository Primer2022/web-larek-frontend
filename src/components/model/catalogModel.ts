import { ICatalogModel, IEventEmmiter, IProduct } from '../../types';

export class CatalogModel implements ICatalogModel {
	constructor(protected events: IEventEmmiter) {}

	items: Map<string, IProduct> = new Map();

	addItem(id: string, item: IProduct): void {
		this.items.set(id, item);
		const items: Map<string, IProduct> = new Map<string, IProduct>();
		items.set(id, item);
		this._changed(items);
	}

	setItems(items: Map<string, IProduct>): void {
		this.items = items;
		this._changed(items);
	}

	getProduct(id: string): IProduct {
		return this.items.get(id);
	}

	protected _changed(items: Map<string, IProduct>) {
		this.events.emit('catalog:change', {
			items: Array.from(items.keys()),
		});
	}
}
