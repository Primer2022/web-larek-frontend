import { IEventEmmiter, IView } from '../../types';

export class ContactsFormView implements IView {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;
	protected orderButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		this.email = container.querySelector('.form__input[name="email"]');
		this.phone = container.querySelector('.form__input[name="phone"]');
		this.orderButton = container.querySelector('.button');

		this.email.addEventListener('input', () => {
			events.emit('ui:contacts-validate', {
				button: this.orderButton,
				emailInput: this.email,
				phoneInput: this.phone,
			});
		});

		this.phone.addEventListener('input', () => {
			events.emit('ui:contacts-validate', {
				button: this.orderButton,
				emailInput: this.email,
				phoneInput: this.phone,
			});
		});

		this.orderButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.events.emit('ui:contacts-order', {
				email: this.email.value,
				phone: this.phone.value,
			});
		});
	}

	reset(): void {
		this.email.value = '';
		this.phone.value = '';
		this.orderButton.disabled = true;
	}

	render(): HTMLElement {
		this.reset();
		return this.container;
	}
}
