import { IProduct } from "../../types";

export class ProductList {
  total: number;
  items: IProduct[];

  constructor(items: IProduct[]) {
    this.items = items;
    this.total = items.length;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.total = items.length;
  }
}