import { IBasketListItem, IBasketModel, IEventEmmiter } from '../../types';
import { BasketItemView } from '../view/basketItemView';

export class BasketPresenter {
	constructor(
		protected events: IEventEmmiter,
		protected basketItemTemplate: HTMLTemplateElement,
		protected basketModel: IBasketModel
	) {}

	addItem(item: IBasketListItem): BasketItemView {
		const basketItemView = new BasketItemView(
			item.product.id,
			this.basketItemTemplate,
			this.events
		);
		this.basketModel.itemsView.set(item.product.id, basketItemView);
		return basketItemView;
	}

	removeItem(id: string): void {
		this.basketModel.itemsView.get(id).remove();
		this.basketModel.itemsView.delete(id);
	}

	setBasketListIndex() {
		const itemsView = this.basketModel.itemsView;
		const itemsId: string[] = Array.from(itemsView.keys());
		for (let i = 0; i < itemsId.length; i++) {
			const id = itemsId[i];
			itemsView.get(id).setItemIndex(i+1)
		}
	}
}
