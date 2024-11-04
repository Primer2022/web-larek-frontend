import { Modal } from "../../base/modal";
import { IEventEmmiter, IProduct } from "../../../types";

export class BasketModal extends Modal {

  protected title: HTMLHeadingElement;
  protected basketList: HTMLUListElement;
  protected orderButton: HTMLButtonElement;
  protected price: HTMLSpanElement;

  constructor(protected container: HTMLElement, protected template: HTMLTemplateElement, protected events: IEventEmmiter) {
    super(container, template, events);
  }

  fill(items: Map<IProduct, number>, price: number): void {
    const modalContainer = this.container.querySelector('.basket');
    const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

    this.basketList = modalContainer.querySelector('.basket__list');
    this.orderButton = modalContainer.querySelector('.basket__button');
    this.price = modalContainer.querySelector('.basket__price');

    this.orderButton.addEventListener('click', () => {
      this.events.emit('ui:basket-click-order', {});
    })

    this.basketList.replaceChildren("");

    if(items) {
      let basketItemIndex = 1;
      items.forEach((price, product)  => {
        const cardBasket = basketItemTemplate.content.cloneNode(true) as HTMLDivElement
        cardBasket.querySelector('.basket__item-index').textContent = String(basketItemIndex);
        cardBasket.querySelector('.card__title').textContent = product.title;
        cardBasket.querySelector('.card__price').textContent = `${price == null ? 0 : price} синапсов`
        cardBasket.querySelector('.basket__item-delete').addEventListener('click', event => {
          this.events.emit('ui:basket-remove', {id: product.id});
        });
        this.basketList.appendChild(cardBasket);
        basketItemIndex++;
      })
      this.price.textContent = `${price} синапсов`;
    }
  }

}