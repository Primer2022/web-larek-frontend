import { Modal } from "../../base/modal";
import { IEventEmmiter } from "../../../types";

export class OrderSuccessModal extends Modal {

  protected description: HTMLParagraphElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    protected template: HTMLTemplateElement,
    protected events: IEventEmmiter
  ) {
    super(container, template, events);
  }

  fill(price: number): void {
    const modalContainer = this.container.querySelector('.order-success');
    this.description = modalContainer.querySelector('.order-success__description');
    this.closeButton = modalContainer.querySelector('.order-success__close');

    this.description.textContent = `Списано ${price} синапсов`;
    this.closeButton.addEventListener('click', () => {
      this.close();
    })
  }
}