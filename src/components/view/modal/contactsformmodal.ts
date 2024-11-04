import { Modal } from "../../base/modal";
import { IEventEmmiter, IOrder } from "../../../types";

export class ContactsFormModal extends Modal {

  protected emailFormInput: HTMLInputElement;
  protected phoneFormInput: HTMLInputElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    protected template: HTMLTemplateElement,
    protected events: IEventEmmiter
  ) {
    super(container, template, events);
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

  addEventListeners(order: IOrder): void {
    const modalContainer = this.container.querySelector('.form');
    this.emailFormInput = modalContainer.querySelector('.form__input[name="email"]');
    this.phoneFormInput = modalContainer.querySelector('.form__input[name="phone"]');
    this.orderButton = modalContainer.querySelector('.button');

    this.emailFormInput.addEventListener('input', () => {
      this.orderButton.disabled = !this.valid();
    })

    this.phoneFormInput.addEventListener('input', () => {
      this.orderButton.disabled = !this.valid();
    })

    this.orderButton.addEventListener('click', event => {
      event.preventDefault();
      order.email = this.emailFormInput.value;
      order.phone = this.phoneFormInput.value;
      this.events.emit('ui:contacts-order', order);
      this.events.emit('basket:change', {event: { items: null }});
    })
  }
}