import { Modal } from "../../base/modal";
import { IBasketListItem, IEventEmmiter, IProduct } from "../../../types";

export class BasketModal extends Modal {

  protected title: HTMLHeadingElement;
  protected basketList: HTMLUListElement;
  protected orderButton: HTMLButtonElement;
  protected price: HTMLSpanElement;
  protected basketItemTemplate: HTMLTemplateElement;

  constructor(protected container: HTMLDivElement, protected events: IEventEmmiter) {
    super(container, events);
    this.basketList = container.querySelector('.basket__list');
    this.orderButton = container.querySelector('.button');
    this.price = container.querySelector('.basket__price');
    this.basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    this.orderButton.addEventListener('click', () => {
      this.events.emit('ui:basket-click-order', {});
      this.close();
    })
    this.setPrice(0);
  }

  setPrice(price: number): void {
    this.price.textContent = `${price} синапсов`;
  }

  setListIndex(items: Map<number, string>): void {
    items.forEach((id: string, index: number) => {
      this.setItemIndex(id, index);
    })
  }

  setItemIndex(id: string, index: number): void {
    const cardBasket = document.getElementById(`${id}`);
    if(cardBasket) {
      cardBasket.querySelector('.basket__item-index').textContent = String(index);
    }
  }

  addItem(item: IBasketListItem): void {
		const cardBasket: HTMLDivElement = this.basketItemTemplate.content.cloneNode(true) as HTMLDivElement;
    const container = cardBasket.querySelector('.basket__item-index').parentElement;
    const itemIndex: HTMLSpanElement = cardBasket.querySelector('.basket__item-index');

    container.id = item.product.id;
		itemIndex.textContent = String(0);
    itemIndex.classList.add(item.product.id);
		cardBasket.querySelector('.card__title').textContent = item.product.title;
		cardBasket.querySelector('.card__price').textContent = `${item.price == null ? 0 : item.price} синапсов`
		cardBasket.querySelector('.basket__item-delete').addEventListener('click', event => {
			this.events.emit('ui:basket-remove', {id: item.product.id});
		});
		this.basketList.appendChild(cardBasket);
  }

	removeItem(id: string): void {
    const cardBasket = document.getElementById(`${id}`);

		if(cardBasket) {
			cardBasket.remove();
		}
	}
}