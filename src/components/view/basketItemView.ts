import { IEventEmmiter, IView } from '../../types';

export class BasketItemView implements IView {
	protected title: HTMLSpanElement;
	protected price: HTMLSpanElement;
	protected removeButton: HTMLButtonElement;
	protected itemIndex: HTMLSpanElement;

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
		this.removeButton.addEventListener('click', () => {
			events.emit('ui:basket-remove', { id: id });
		})
		this.itemIndex = basketItem.querySelector(
			'.basket__item-index'
		);
		this.itemIndex.parentElement.id = id;
		this.itemIndex.textContent = String(0);
		this.itemIndex.classList.add(id);
		container.appendChild(basketItem);
	}

	render(data?: { id: string; title: string; price: number }): HTMLElement {
		if (data) {
			this.id = data.id;
			this.title.textContent = data.title;
			this.price.textContent = `${data.price == null ? 0 : data.price} синапсов`;
		}
		return this.container;
	}
}
