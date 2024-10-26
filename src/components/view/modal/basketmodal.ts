import { Modal } from "../../base/modal";
import { IEventEmmiter, IProduct } from "../../../types";
import { CatalogModel } from "../../model/catalogmodel";
import { BasketModel } from "../../model/basketmodel";

export class BasketModal extends Modal {

  protected title: HTMLHeadingElement;
  protected basketList: HTMLUListElement;
  protected orderButton: HTMLButtonElement;
  protected price: HTMLSpanElement;

  constructor(protected container: HTMLElement, protected template: HTMLTemplateElement, protected events: IEventEmmiter) {
    super(container, template, events);
  }

  fill(items: Map<string, number>, catalogModel: CatalogModel, basketModel: BasketModel): void {
    const price = basketModel.getPrice(catalogModel);
    const modalContainer = this.container.querySelector('.basket');
    const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

    this.basketList = modalContainer.querySelector('.basket__list');
    this.orderButton = modalContainer.querySelector('.basket__button');
    this.price = modalContainer.querySelector('.basket__price');

    this.orderButton.addEventListener('click', () => {
      if(basketModel.items.size < 1) {
        return;
      }

      this.events.emit('ui:basket-click-order', {});
    })

    if(items) {
      let basketItemIndex = 1;
      items.forEach((amount, id)  => {
        const product = catalogModel.getProduct(id);
        const cardBasket = basketItemTemplate.content.cloneNode(true) as HTMLDivElement
        const price = product.price * amount;
        cardBasket.querySelector('.basket__item-index').textContent = String(basketItemIndex);
        cardBasket.querySelector('.card__title').textContent = product.title;
        cardBasket.querySelector('.card__price').textContent = `${price == null ? 0 : price} синапсов`
        cardBasket.querySelector('.basket__item-delete').addEventListener('click', event => {
          this.events.emit('ui:basket-remove', {id: id});
        });
        this.basketList.appendChild(cardBasket);
        basketItemIndex++;
      })
      this.price.textContent = `${price} синапсов`;
    }
  }

}