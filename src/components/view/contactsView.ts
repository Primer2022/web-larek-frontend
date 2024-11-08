import { IEventEmmiter, IView } from '../../types';

export class ContactsView implements IView {
	protected email: string;
	protected phone: string;
	protected orderButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter,
	) {
		const orderDiv = container.querySelector('.order');
		this.email = orderDiv.querySelector(
			'.form__input[name="email"]'
		).textContent;
		this.phone = orderDiv.querySelector(
			'.form__input[name="phone"]'
		).textContent;
		this.orderButton = container.querySelector('.order__button');

		this.orderButton.addEventListener('click', () => {
			events.emit('ui:contacts-order', {
				email: this.email,
				phone: this.phone,
			});
		});
	}

	render(data?: { email: string; phone: string }): HTMLElement {
		if (data) {
			this.email = data.email;
			this.phone = data.phone;
		}
		return this.container;
	}
}
