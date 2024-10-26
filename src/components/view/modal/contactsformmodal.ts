import { Modal } from "../../base/modal";
import { IEventEmmiter } from "../../../types";

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

  reset(): void {
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
      this.events.emit('ui:contacts-order', {});
      this.events.emit('basket:change', {event: { items: null }});
    })
  }
}