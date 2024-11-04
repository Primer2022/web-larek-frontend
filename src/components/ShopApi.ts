import { Api } from './base/api';
import { ProductList } from "./base/productlist";
import { API_URL, BASE_URL, CDN_URL } from "../utils/constants";
import { IOrder } from "../types";

export class ShopApi extends Api {
	async getProductList() {
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		};
		return this.get(`${API_URL}/product/`).then((response) => {
			const productList = response as ProductList;
			productList.items.map(async (product: any) => {
				product.image = `${BASE_URL + CDN_URL}${product.image}`;
				return product;
			})
			return productList;
		});
	}

	async order(order: IOrder) {
		console.log(order);
		this.options = {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			}
		};
		return this.post(`${API_URL}/order`, order).then((response) => {
			console.log(response);
		})
	}
}
