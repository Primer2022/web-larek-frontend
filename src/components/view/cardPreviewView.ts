import { IEventEmmiter, IView } from '../../types';
import { CatalogModel } from '../model/catalogModel';

export class CardPreviewView implements IView {
	protected id: string;
	protected image: HTMLImageElement;
	protected category: HTMLSpanElement;
	protected title: HTMLHeadingElement;
	protected text: HTMLParagraphElement;
	protected price: HTMLSpanElement;
	protected basketAddButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter,
		protected catalogModel: CatalogModel
	) {
		this.image = container.querySelector('.card__image');
		this.category = container.querySelector('.card__category');
		this.title = container.querySelector('.card__title');
		this.text = container.querySelector('.card__text');
		this.price = container.querySelector('.card__price');
		this.basketAddButton = container.querySelector('.button');
		this.basketAddButton.addEventListener('click', () => {
			events.emit('ui:basket-add', { id: this.id });
			events.emit('ui:modal-close', {});
		});
	}

	render(data?: {
		image: string;
		category: string;
		title: string;
		text: string;
		price: number;
		id: string;
	}): HTMLElement {
		if (data) {
			this.image.src = data.image;
			this.category.textContent = data.category;
			this.title.textContent = data.title;
			this.text.textContent = data.text;
			this.price.textContent = `${
				data.price == null ? 0 : data.price
			} синапсов`;
			this.id = data.id;
			for (const value of this.category.classList.values())
				this.category.classList.remove(value);

			this.category.classList.add('card__category');
			this.category.classList.add(
				this.catalogModel.getCategoryClass(data.category)
			);
		}
		return this.container;
	}
}
