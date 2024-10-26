import { IEventEmmiter, IView } from '../../types';

export class BasketItemView implements IView {
	protected title: HTMLSpanElement;
	protected price: HTMLSpanElement;
	protected removeButton: HTMLButtonElement;

	constructor(
		protected id: string | null = null,
		protected container: HTMLElement,
		protected template: HTMLTemplateElement,
		protected events: IEventEmmiter
	) {
		const basketItem = template.content.cloneNode(true) as HTMLLIElement;
		this.title = basketItem.querySelector(
			'.card__title'
		) as HTMLSpanElement;
		this.removeButton = basketItem.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;
		this.price = basketItem.querySelector(
			'.card__price'
		) as HTMLSpanElement;
		container.appendChild(basketItem);

		// this.removeButton.addEventListener('click', () => {
		// 	this.events.emit('ui:basket-remove', { id: this.id });
		// });
	}

	render(data?: { id: string; title: string; price: number }): HTMLElement {
		if (data) {
			this.id = data.id;
			this.title.textContent = data.title;
			this.price.textContent = `${data.price} синапсов`;
		}
		return this.container;
	}
}
