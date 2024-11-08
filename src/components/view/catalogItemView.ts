import { IEventEmmiter, IView } from '../../types';
import { CatalogModel } from "../model/catalogModel";

export class CatalogItemView implements IView {
	protected container: HTMLButtonElement;
	protected title: HTMLHeadingElement;
	protected category: HTMLSpanElement;
	protected image: HTMLImageElement;
	protected price: HTMLSpanElement;

	constructor(
		protected id: string | null,
		protected template: HTMLTemplateElement,
		protected events: IEventEmmiter,
		protected catalogModel: CatalogModel
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

	render(data?: {
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
			this.category.classList.add(this.catalogModel.getCategoryClass(data.category));
			this.price.textContent = `${data.price == null ? 0 : data.price} синапсов`;
		}
		return this.container;
	}
}
