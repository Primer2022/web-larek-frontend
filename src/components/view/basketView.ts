import { IEventEmmiter, IView } from '../../types';
import { BasketItemView } from './basketItemView';

export class BasketView implements IView {
	protected title: HTMLHeadingElement;
	protected basketList: HTMLUListElement;
	protected orderButton: HTMLButtonElement;
	protected price: HTMLSpanElement;
	protected counter: HTMLSpanElement;
	itemsView: Map<string, BasketItemView> = new Map();

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		const basketButton: HTMLButtonElement =
			document.querySelector('.header__basket');
		this.basketList = container.querySelector('.basket__list');
		this.counter = document.querySelector('.header__basket-counter');
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

	setCounter(size: number): void {
		this.counter.textContent = String(size);
	}

	addItem(basketItem: HTMLElement): void {
		this.basketList.appendChild(basketItem);
	}

	reset(): void {
		this.setCounter(0);
		this.setPrice(0);
		this.basketList.replaceChildren();
	}

	setBasketListIndex() {
		const itemsId: string[] = Array.from(this.itemsView.keys());
		for (let i = 0; i < itemsId.length; i++) {
			const id = itemsId[i];
			this.itemsView.get(id).setItemIndex(i + 1);
		}
	}

	render(data?: { size: number; price: number }): HTMLElement {
		if (data) {
			this.orderButton.disabled = data.size < 1;

			this.setCounter(data.size);
			this.setPrice(data.price);
		}
		return this.container;
	}
}
