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

  constructor(protected container: HTMLElement, protected template: HTMLTemplateElement, protected events: IEventEmmiter) {
    super(container, template, events);
    this.events = events;
  }

  fill(product: IProduct): void {
    const modalContainer = this.container.querySelector('.card_full');
    this.image = modalContainer.querySelector('.card__image');
    this.category = modalContainer.querySelector('.card__category');
    this.title = modalContainer.querySelector('.card__title');
    this.text = modalContainer.querySelector('.card__text');
    this.price = modalContainer.querySelector('.card__price');
    this.basketAddButton = modalContainer.querySelector('.button');

    this.basketAddButton.addEventListener('click', () => {
      this.events.emit('ui:basket-add', {id: this.id})
      this.close();
    })

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