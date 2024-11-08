import { IEventEmmiter, IView } from "../../types";

export class BasketView implements IView {
	constructor(protected container: HTMLElement,
							protected events: IEventEmmiter) {
		const basketButton: HTMLButtonElement = document.querySelector('.header__basket');
		basketButton.addEventListener('click', () => {
			events.emit('ui:basket-click', {});
		})
	}

	render(data?: { size: number }): HTMLElement {
		if (data) {
			const counter: HTMLSpanElement = document.querySelector('.header__basket-counter');
			counter.textContent = String(data.size);
		}
		return this.container;
	}
}
