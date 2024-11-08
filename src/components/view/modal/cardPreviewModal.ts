import { Modal } from "../../base/modal";
import { IEventEmmiter, IProduct } from "../../../types";

export class CardPreviewModal extends Modal {

  protected id: string;
  protected image: HTMLImageElement;
  protected category: HTMLSpanElement;
  protected title: HTMLHeadingElement;
  protected text: HTMLParagraphElement;
  protected price: HTMLSpanElement;
  protected basketAddButton: HTMLButtonElement;

  constructor(protected container: HTMLDivElement, protected events: IEventEmmiter) {
    super(container, events);
    this.image = container.querySelector('.card__image');
    this.category = container.querySelector('.card__category');
    this.title = container.querySelector('.card__title');
    this.text = container.querySelector('.card__text');
    this.price = container.querySelector('.card__price');
    this.basketAddButton = container.querySelector('.button');
    this.basketAddButton.addEventListener('click', () => {
      this.events.emit('ui:basket-add', {id: this.id})
      this.close();
    })
  }

  fill(product: IProduct): void {
    if(product) {
      this.image.src = product.image;
      this.category.textContent = product.category;
      this.title.textContent = product.title;
      this.text.textContent = product.description;
      this.price.textContent = `${product.price == null ? 0 : product.price} синапсов`;
      this.id = product.id;
    }
  }

}