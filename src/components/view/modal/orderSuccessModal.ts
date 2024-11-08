import { Modal } from "../../base/modal";
import { IEventEmmiter } from "../../../types";

export class OrderSuccessModal extends Modal {

  protected description: HTMLParagraphElement;
  protected successOrderButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEventEmmiter) {
    super(container, events);
    this.description = container.querySelector('.film__description');
    this.successOrderButton = container.querySelector('.order-success__close');
    this.successOrderButton.addEventListener('click', () => {
      this.close();
    })
  }

  setPrice(price: number): void {
    this.description.textContent = `Списано ${price} синапсов`;
  }
}