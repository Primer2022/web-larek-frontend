import { IEventEmmiter, IView } from '../../types';

export class BasketView implements IView {
	protected title: HTMLHeadingElement;
	protected basketList: HTMLUListElement;
	protected orderButton: HTMLButtonElement;
	protected price: HTMLSpanElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
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

	setCounter(size: number): void {
		const counter: HTMLSpanElement = document.querySelector(
			'.header__basket-counter'
		);
		counter.textContent = String(size);
	}

	addItem(basketItem: HTMLElement): void {
		this.basketList.appendChild(basketItem);
	}

	reset(): void {
		this.setCounter(0);
		this.setPrice(0);
		this.basketList.replaceChildren();
	}

	render(data?: { size: number; price: number }): HTMLElement {
		if (data) {
			this.setCounter(data.size);
			this.setPrice(data.price);
		}
		return this.container;
	}
}
