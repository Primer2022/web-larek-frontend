import { Api } from './base/api';
import { ProductList } from './base/productList';
import { API_URL, BASE_URL, CDN_URL } from '../utils/constants';
import { IOrder, IProduct } from '../types';
import { CatalogModel } from './model/catalogModel';

export class ShopApi extends Api {
	async loadProductList(catalogModel: CatalogModel) {
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		};
		const productList: ProductList = await this.get(`${API_URL}/product/`).then(
			(response) => {
				const productList = response as ProductList;
				productList.items.map(async (product: any) => {
					product.image = `${BASE_URL + CDN_URL}${product.image}`;
					return product;
				});
				return productList;
			}
		).catch(() => {
			return null;
		});

		if (productList) {
			for (const product of productList.items) {
				catalogModel.addItem(product.id, product);
			}
		}

		return productList;
	}

	async order(order: IOrder) {
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		};
		return this.post(`${API_URL}/order`, order);
	}
}
