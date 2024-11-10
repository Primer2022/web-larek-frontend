import { Api } from './base/api';
import { API_URL, BASE_URL, CDN_URL } from '../utils/constants';
import { IOrder, IProduct } from '../types';

export class ShopApi extends Api {
	loadProductList() {
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		};
		return this.get(`${API_URL}/product/`).then((response) => {
			const productList = response as {
				total: number;
				items: IProduct[];
			};
			productList.items.map((product: any) => {
				product.image = `${BASE_URL + CDN_URL}${product.image}`;
				return product;
			});
			return productList;
		});
	}

	order(order: IOrder) {
		order.items.forEach(item => {
			console.log(item);
		})
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		};
		return this.post(`${API_URL}/order`, order);
	}
}
