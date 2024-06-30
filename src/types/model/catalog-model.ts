interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]) : void;
    getProduct(id: string) : IProduct;
}

class CatalogModel implements ICatalogModel {
    items: IProduct[];

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getProduct(id: string): IProduct {
        return this.items.filter(product => product.name === id)[0];
    }
}