import { IEventEmmiter, IView } from '../../types';

export class CatalogItemView implements IView {
	protected container: HTMLButtonElement;
	protected title: HTMLHeadingElement;
	protected category: HTMLSpanElement;
	protected image: HTMLImageElement;
	protected price: HTMLSpanElement;

	constructor(
		protected id: string | null,
		protected template: HTMLTemplateElement,
		protected events: IEventEmmiter
	) {
		this.container = template.content.querySelector(".gallery__item").cloneNode(true) as HTMLButtonElement;
		this.title = this.container.querySelector('.card__title') as HTMLHeadingElement;
		this.category = this.container.querySelector(
			'.card__category'
		) as HTMLSpanElement;
		this.image = this.container.querySelector('.card__image') as HTMLImageElement;
		this.price = this.container.querySelector('.card__price') as HTMLSpanElement;

		this.container.addEventListener('click', () => {
			this.events.emit('ui:catalog-click', { id: this.id });
		});
	}

	render(container: HTMLElement, data?: {
		id: string;
		image: string;
		title: string;
		category: string;
		price: number;
	}): HTMLElement {
		if (data) {
			this.id = data.id;
			this.image.src = data.image;
			this.title.textContent = data.title;
			this.category.textContent = data.category;
			switch (this.category.textContent) {
				case "софт-скил": {
					this.category.classList.add('card__category_soft');
					break;
				}
				case "другое": {
					this.category.classList.add('card__category_other');
					break;
				}
				case "дополнительное": {
					this.category.classList.add('card__category_additional');
					break;
				}
				case "кнопка": {
					this.category.classList.add('card__category_button');
					break;
				}
				case "хард-скил": {
					this.category.classList.add('card__category_hard');
					break;
				}
				default: {
					this.category.classList.add('card__category_other');
				}
			}
			this.price.textContent = `${data.price == null ? 0 : data.price} синапсов`;
		}
		return this.container;
	}
}
