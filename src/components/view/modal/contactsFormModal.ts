import { Modal } from "../../base/modal";
import { IEventEmmiter, IOrder } from "../../../types";

export class ContactsFormModal extends Modal {

  protected emailFormInput: HTMLInputElement;
  protected phoneFormInput: HTMLInputElement;
  protected orderButton: HTMLButtonElement;
  protected order: IOrder;

  constructor(protected container: HTMLDivElement, protected events: IEventEmmiter) {
    super(container, events);
    this.emailFormInput = container.querySelector('.form__input[name="email"]');
    this.phoneFormInput = container.querySelector('.form__input[name="phone"]');
    this.orderButton = container.querySelector('.button');

    this.emailFormInput.addEventListener('input', () => {
      this.orderButton.disabled = !this.valid();
    })

    this.phoneFormInput.addEventListener('input', () => {
      this.orderButton.disabled = !this.valid();
    })

    this.orderButton.addEventListener('click', event => {
      event.preventDefault();
      this.order.email = this.emailFormInput.value;
      this.order.phone = this.phoneFormInput.value;
      this.events.emit('ui:contacts-order', this.order);
    })
  }

  protected valid(): boolean {
    return this.emailFormInput.validity.valid && this.phoneFormInput.validity.valid;
  }

  setPhone(value: string): void {
    this.phoneFormInput.value = value;
  }

  setEmail(value: string): void {
    this.emailFormInput.value = value;
  }

  setOrder(order: IOrder): void {
    this.order = order;
  }

  reset(): void {
    this.emailFormInput.value = '';
    this.phoneFormInput.value = '';
  }
}