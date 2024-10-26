import { Modal } from '../../base/modal';
import { IEventEmmiter } from '../../../types';

export class OrderFormModal extends Modal {

	protected addressInput: HTMLInputElement;
	protected paymentButtons: HTMLButtonElement[] = [];
	protected paymentMethod: string;
	protected orderButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected template: HTMLTemplateElement,
		protected events: IEventEmmiter
	) {
		super(container, template, events);
	}

	reset(): void {
		const modalContainer = this.container.querySelector('.form');
		this.addressInput = modalContainer.querySelector('.form__input[name="address"]');
		this.orderButton = modalContainer.querySelector('.order__button');
		this.addressInput.value = '';
		modalContainer.querySelectorAll('.button_alt').forEach(button => {
			this.paymentButtons.push(button as HTMLButtonElement);
			button.addEventListener('click', event => {
				const button = (event.target as HTMLButtonElement);
				if(!button.classList.contains('button_alt-active')) {
					this.paymentButtons.forEach(button => {
						button.classList.remove('button_alt-active')
					});
					button.classList.add('button_alt-active');
					this.paymentMethod = button.value;
				}
			})
		})
		this.addressInput.addEventListener('input', event => {
			const input = event.target as HTMLInputElement;
			this.orderButton["disabled"] = input.value == '';
		})
		this.orderButton.addEventListener('click', event => {
			event.preventDefault();
			this.events.emit('ui:order', { payMethod: this.paymentMethod, address: this.addressInput.value })
		})
	}
}