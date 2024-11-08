import { IView } from "../../types";
import { EventEmitter } from "../base/events";

export class OrderSuccessView implements IView {
  
	protected description: HTMLParagraphElement;
	protected successOrderButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: EventEmitter) {
    this.description = container.querySelector('.film__description');
		this.successOrderButton = container.querySelector('.order-success__close');
		this.successOrderButton.addEventListener('click', () => {
			events.emit('ui:modal-close', {});
		});
  }

	render(data?: { price: number }): HTMLElement {
		if (data) {
      this.description.textContent = `Списано ${data.price} синапсов`;
		}
		return this.container;
	}
}
