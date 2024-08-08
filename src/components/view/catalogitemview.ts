import { IEventEmmiter, IView } from '../../types';

export class CatalogItemView implements IView {
	protected cardButton: HTMLButtonElement;
	protected title: HTMLHeadingElement;
	protected category: HTMLSpanElement;
	protected image: HTMLImageElement;
	protected price: HTMLSpanElement;

	protected id: string | null = null;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		this.cardButton = container.querySelector('.card') as HTMLButtonElement;
		this.title = container.querySelector('.card__title') as HTMLHeadingElement;
		this.category = container.querySelector(
			'.card__category'
		) as HTMLSpanElement;
		this.image = container.querySelector('.card__image') as HTMLImageElement;
		this.price = container.querySelector('.card__price') as HTMLSpanElement;

		this.cardButton.addEventListener('click', () => {
			this.events.emit('ui:catalog-click', { id: this.id });
		});
	}

	render(data?: {
		id: string;
		title: string;
		category: string;
		image: string;
		price: string;
	}): HTMLElement {
		if (data) {
			this.id = data.id;
			this.title.textContent = data.title;
			this.category.textContent = data.category;
			this.image.src = data.image;
			this.price.textContent = data.price;
		}
		return this.container;
	}
}
