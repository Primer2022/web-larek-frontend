import { IEventEmmiter, IView } from '../../types';

export class BasketItemView implements IView {
	protected title: HTMLSpanElement;
	protected price: HTMLSpanElement;
	protected removeButton: HTMLButtonElement;
	protected itemIndex: HTMLSpanElement;
	protected container: HTMLElement;

	constructor(
		protected id: string | null = null,
		protected template: HTMLTemplateElement,
		protected events: IEventEmmiter
	) {
		this.container = template.content.cloneNode(true) as HTMLLIElement;
		this.title = this.container.querySelector(
			'.card__title'
		) as HTMLSpanElement;
		this.removeButton = this.container.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;
		this.price = this.container.querySelector(
			'.card__price'
		) as HTMLSpanElement;
		this.removeButton.addEventListener('click', () => {
			events.emit('ui:basket-remove', { id: id });
		})
		this.itemIndex = this.container.querySelector(
			'.basket__item-index'
		);
		this.itemIndex.textContent = String(0);
	}

	remove(): void {
		this.itemIndex.parentElement.remove();
	}

	setItemIndex(index: number): void {
		this.itemIndex.textContent = String(index);
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
