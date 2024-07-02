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
  title: string;
}

export interface ICatalogModel {
  items: IProduct[];

  setItems(items: IProduct[]): void;

  getProduct(id: string): IProduct;
}

export interface IViewConstructor {
  new (container: HTMLElement, events?: IEventEmmiter): IView;
}

export interface IView {
	render(data?: object): HTMLElement;
}