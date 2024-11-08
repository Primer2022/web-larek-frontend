import { Modal } from '../../base/modal';
import { IEventEmmiter, IOrder } from "../../../types";

export class OrderFormModal extends Modal {

	protected addressInput: HTMLInputElement;
	protected paymentButtons: HTMLButtonElement[] = [];
	protected paymentMethod = 'card';
	protected orderButton: HTMLButtonElement;
	protected order: IOrder;

	constructor(protected container: HTMLDivElement, protected events: IEventEmmiter) {
		super(container, events);
		this.addressInput = container.querySelector('.form__input[name="address"]');
		this.orderButton = container.querySelector('.modal__actions').querySelector('.button');
		container.querySelectorAll('.button_alt').forEach(button => {
			this.paymentButtons.push(button as HTMLButtonElement);
			button.addEventListener('click', event => {
				const button = (event.target as HTMLButtonElement);
				if(!button.classList.contains('button_alt-active')) {
					this.paymentButtons.forEach(button => {
						button.classList.remove('button_alt-active')
					});
					button.classList.add('button_alt-active');
					this.paymentMethod = button.name;
				}
			})
		})
		this.addressInput.addEventListener('input', event => {
			const input = event.target as HTMLInputElement;
			this.orderButton["disabled"] = input.value == '';
		})
		this.orderButton.addEventListener('click', event => {
			event.preventDefault();
			this.order.address = this.addressInput.value;
			this.order.payment = this.paymentMethod;
			this.close();
			this.events.emit('ui:order', this.order)
		})
	}

	setOrder(order: IOrder): void {
		this.order = order;
	}

	reset(): void {
		this.addressInput.value = '';
		this.paymentMethod = 'card'
		this.paymentButtons.forEach(button => {
			button.classList.remove('button_alt-active')
		});
		this.paymentButtons[0].classList.add('button_alt-active');
	}
}