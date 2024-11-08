import { IBasketListItem, IEventEmmiter, IView } from '../../types';
import { BasketItemView } from './basketItemView';

export class BasketView implements IView {
	protected title: HTMLHeadingElement;
	protected basketList: HTMLUListElement;
	protected orderButton: HTMLButtonElement;
	protected price: HTMLSpanElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter,
		protected basketItemTemplate: HTMLTemplateElement
	) {
		const basketButton: HTMLButtonElement =
			document.querySelector('.header__basket');
		this.basketList = container.querySelector('.basket__list');
		this.orderButton = container.querySelector('.button');
		this.price = container.querySelector('.basket__price');
		this.orderButton.addEventListener('click', () => {
			this.events.emit('ui:basket-click-order', {});
		});
		this.setPrice(0);
		basketButton.addEventListener('click', () => {
			events.emit('ui:basket-click', {});
		});
	}

	setPrice(price: number): void {
		this.price.textContent = `${price} синапсов`;
	}

	setListIndex(items: Map<number, string>): void {
		items.forEach((id: string, index: number) => {
			this.setItemIndex(id, index);
		});
	}

	setItemIndex(id: string, index: number): void {
		const cardBasket = document.getElementById(`${id}`);
		if (cardBasket) {
			cardBasket.querySelector('.basket__item-index').textContent =
				String(index);
		}
	}

	addItem(item: IBasketListItem): void {
		const basketItemView = new BasketItemView(
			item.product.id,
			this.basketList,
			this.basketItemTemplate,
			this.events
		);
		basketItemView.render({
			id: item.product.id,
			title: item.product.title,
			price: item.product.price,
		});
	}

	removeItem(id: string): void {
		const basketItem = document.getElementById(`${id}`);

		if (basketItem) {
			basketItem.remove();
		}
	}

	render(data?: { size: number; price: number }): HTMLElement {
		if (data) {
			const counter: HTMLSpanElement = document.querySelector(
				'.header__basket-counter'
			);
			counter.textContent = String(data.size);
			this.setPrice(data.price);
		}
		return this.container;
	}
}
