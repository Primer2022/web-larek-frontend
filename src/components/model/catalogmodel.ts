import { IEventEmmiter, IProduct } from "../../types";

export class CatalogModel {
  constructor(protected events: IEventEmmiter) {}

  items: Map<string, IProduct> = new Map();

  setItems(items: Map<string, IProduct>): void {
    this.items = items;
    this._changed()
  }

  getProduct(id: string): IProduct {
    return this.items.get(id);
  }

  protected _changed() {
    this.events.emit('catalog:change', { items: Array.from(this.items.keys()) });
  }
}